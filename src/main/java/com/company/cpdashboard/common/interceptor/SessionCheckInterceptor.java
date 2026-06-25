package com.company.cpdashboard.common.interceptor;

import com.company.cpdashboard.common.exception.UnauthorizedException;
import com.company.cpdashboard.common.session.SessionUserHolder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 보호 대상 API 진입 전 세션 존재 여부를 검사한다.
 */
@Component
public class SessionCheckInterceptor implements HandlerInterceptor {

    private final SessionUserHolder sessionUserHolder;

    public SessionCheckInterceptor(SessionUserHolder sessionUserHolder) {
        this.sessionUserHolder = sessionUserHolder;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 세션이 없거나 loginUser가 비어 있으면 로그인된 요청으로 보지 않는다.
        HttpSession session = request.getSession(false);
        if (session == null || sessionUserHolder.getLoginUser(session) == null) {
            throw new UnauthorizedException("Login session is required");
        }
        return true;
    }
}
