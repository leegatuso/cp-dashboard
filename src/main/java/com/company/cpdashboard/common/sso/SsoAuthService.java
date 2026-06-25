package com.company.cpdashboard.common.sso;

import com.company.cpdashboard.auth.dto.AuthUserLookup;
import com.company.cpdashboard.auth.dto.SsoLoginRequest;
import com.company.cpdashboard.auth.mapper.AuthMapper;
import com.company.cpdashboard.common.session.LoginUser;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * SSO 또는 사번 입력값을 실제 세션 사용자 정보로 바꾸는 서비스다.
 * 컨트롤러는 이 서비스 결과만 받아 세션에 저장한다.
 */
@Service
public class SsoAuthService {

    private final AuthMapper authMapper;
    private final PlantecsSsoClientAdapter plantecsSsoClientAdapter;
    private final SpitSsoClientAdapter spitSsoClientAdapter;

    public SsoAuthService(
            AuthMapper authMapper,
            PlantecsSsoClientAdapter plantecsSsoClientAdapter,
            SpitSsoClientAdapter spitSsoClientAdapter
    ) {
        this.authMapper = authMapper;
        this.plantecsSsoClientAdapter = plantecsSsoClientAdapter;
        this.spitSsoClientAdapter = spitSsoClientAdapter;
    }

    public LoginUser authenticate(SsoLoginRequest request) throws Exception {
        String empcd = resolveEmpcd(request);
        return loadLoginUser(empcd);
    }

    // 개발용 로그인 화면에서는 사번만 받아 동일한 사용자 조회 로직을 재사용한다.
    public LoginUser authenticateByEmpcd(String empcd) {
        if (!StringUtils.hasText(empcd)) {
            throw new IllegalArgumentException("empcd is required");
        }

        String normalizedEmpcd = empcd.trim();
        normalizedEmpcd = normalizedEmpcd.length() > 6
                ? normalizedEmpcd.substring(normalizedEmpcd.length() - 6)
                : normalizedEmpcd;
        return loadLoginUser(normalizedEmpcd);
    }

    private LoginUser loadLoginUser(String empcd) {
        // 사번 -> 내부 USER_ID -> 최종 사용자 정보 순서로 레거시 조회 흐름을 유지한다.
        String userId = authMapper.getUserId(empcd);

        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("No internal user mapping found for empcd: " + empcd);
        }

        LoginUser loginUser = authMapper.getLoginUser(new AuthUserLookup(userId, empcd));
        if (loginUser == null || !StringUtils.hasText(loginUser.getEmpId())) {
            throw new IllegalArgumentException("No login user found for userId: " + userId);
        }

        return loginUser;
    }

    private String resolveEmpcd(SsoLoginRequest request) throws Exception {
        // 실제 운영에서는 accessToken 케이스가 우선이고, 레거시 token 방식도 함께 열어둔다.
        if (StringUtils.hasText(request.getAccessToken())) {
            return plantecsSsoClientAdapter.resolveEmpcd(request.getAccessToken());
        }

        if (StringUtils.hasText(request.getSsoToken())) {
            if (!StringUtils.hasText(request.getDomainName())) {
                throw new IllegalArgumentException("domainName is required when ssoToken is provided");
            }
            return spitSsoClientAdapter.resolveEmpcd(request.getDomainName(), request.getSsoToken());
        }

        if (StringUtils.hasText(request.getEmpcd())) {
            String empcd = request.getEmpcd().trim();
            return empcd.length() > 6 ? empcd.substring(empcd.length() - 6) : empcd;
        }

        throw new IllegalArgumentException("accessToken, ssoToken, or empcd is required");
    }
}
