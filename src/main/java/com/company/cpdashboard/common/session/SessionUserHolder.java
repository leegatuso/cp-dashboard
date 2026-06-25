package com.company.cpdashboard.common.session;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * HttpSession에 로그인 사용자 정보를 저장하고 꺼내는 공통 헬퍼다.
 * 세션 attribute 이름을 한 곳에서 통일하려고 분리했다.
 */
@Component
public class SessionUserHolder {

    private final String sessionAttributeName;

    public SessionUserHolder(
            @Value("${cp-dashboard.session.user-attribute-name:loginUser}") String sessionAttributeName
    ) {
        this.sessionAttributeName = sessionAttributeName;
    }

    public void setLoginUser(HttpSession session, LoginUser loginUser) {
        session.setAttribute(sessionAttributeName, loginUser);
    }

    public LoginUser getLoginUser(HttpSession session) {
        Object value = session.getAttribute(sessionAttributeName);
        return value instanceof LoginUser loginUser ? loginUser : null;
    }

    public void clear(HttpSession session) {
        session.removeAttribute(sessionAttributeName);
    }
}
