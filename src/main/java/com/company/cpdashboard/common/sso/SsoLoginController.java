package com.company.cpdashboard.common.sso;

import com.company.cpdashboard.auth.dto.DevLoginRequest;
import com.company.cpdashboard.auth.dto.LoginAccessInfo;
import com.company.cpdashboard.auth.dto.SsoLoginRequest;
import com.company.cpdashboard.common.exception.UnauthorizedException;
import com.company.cpdashboard.common.response.ApiResponse;
import com.company.cpdashboard.common.session.LoginUser;
import com.company.cpdashboard.common.session.SessionUserHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 프론트 인증 진입점 컨트롤러다.
 * 세션 조회, SSO 로그인, 개발용 수동 로그인, 로그아웃 API를 한 곳에 둔다.
 */
@RestController
@RequestMapping("/api")
public class SsoLoginController {

    private final SessionUserHolder sessionUserHolder;
    private final SsoAuthService ssoAuthService;
    private final ManualLoginAccessPolicy manualLoginAccessPolicy;

    public SsoLoginController(
            SessionUserHolder sessionUserHolder,
            SsoAuthService ssoAuthService,
            ManualLoginAccessPolicy manualLoginAccessPolicy
    ) {
        this.sessionUserHolder = sessionUserHolder;
        this.ssoAuthService = ssoAuthService;
        this.manualLoginAccessPolicy = manualLoginAccessPolicy;
    }

    @GetMapping("/auth/me")
    public ApiResponse<LoginUser> me(HttpServletRequest request) {
        // 세션이 이미 만들어진 사용자인지 확인할 때 프론트가 가장 먼저 호출한다.
        HttpSession session = request.getSession(false);
        if (session == null) {
            throw new UnauthorizedException("Login session is not available");
        }
        LoginUser loginUser = sessionUserHolder.getLoginUser(session);
        if (loginUser == null) {
            throw new UnauthorizedException("Login session is not available");
        }
        return ApiResponse.ok(loginUser);
    }

    @GetMapping("/auth/login-access")
    public ApiResponse<LoginAccessInfo> loginAccess(HttpServletRequest request) {
        // 로그인 화면 노출 여부는 프론트에서 이 API 응답으로 판단한다.
        String clientIp = manualLoginAccessPolicy.resolveClientIp(request);
        boolean allowed = manualLoginAccessPolicy.isAllowed(request);
        return ApiResponse.ok(new LoginAccessInfo(allowed, clientIp));
    }

    @RequestMapping("/sso/login")
    public ApiResponse<LoginUser> login(@ModelAttribute SsoLoginRequest request, HttpSession session) throws Exception {
        // 외부 SSO 파라미터를 받아 서버 세션을 생성한다.
        LoginUser loginUser = ssoAuthService.authenticate(request);
        sessionUserHolder.setLoginUser(session, loginUser);
        return ApiResponse.ok("SSO login success", loginUser);
    }

    @PostMapping("/auth/dev-login")
    public ApiResponse<LoginUser> devLogin(
            @RequestBody DevLoginRequest request,
            HttpServletRequest httpServletRequest,
            HttpSession session
    ) {
        // 개발 단계에서는 허용 IP에서만 사번 입력 로그인 API를 열어둔다.
        manualLoginAccessPolicy.validate(httpServletRequest);
        LoginUser loginUser = ssoAuthService.authenticateByEmpcd(request.getEmpcd());
        sessionUserHolder.setLoginUser(session, loginUser);
        return ApiResponse.ok("Manual login success", loginUser);
    }

    @PostMapping("/auth/logout")
    public ApiResponse<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            sessionUserHolder.clear(session);
            session.invalidate();
        }
        return ApiResponse.ok("Logout success", null);
    }
}
