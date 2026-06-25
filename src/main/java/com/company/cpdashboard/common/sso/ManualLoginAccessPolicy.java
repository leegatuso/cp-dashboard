package com.company.cpdashboard.common.sso;

import com.company.cpdashboard.common.exception.ForbiddenException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Set;

/**
 * 개발용 수동 로그인 화면을 어떤 IP에 열어둘지 결정한다.
 * 운영 전환 시 이 목록은 실제 사내 허용 IP 기준으로 교체하면 된다.
 */
@Component
public class ManualLoginAccessPolicy {

    // 현재는 로컬 테스트만 허용해 두었다.
    private static final Set<String> ALLOWED_IPS = Set.of(
            "127.0.0.1",
            "::1",
            "0:0:0:0:0:0:0:1"
    );

    public boolean isAllowed(HttpServletRequest request) {
        return ALLOWED_IPS.contains(resolveClientIp(request));
    }

    public String resolveClientIp(HttpServletRequest request) {
        // 프록시 환경을 고려해 전달 헤더를 우선 확인한다.
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            return forwardedFor.split(",")[0].trim();
        }

        String realIp = request.getHeader("X-Real-IP");
        if (StringUtils.hasText(realIp)) {
            return realIp.trim();
        }

        return request.getRemoteAddr();
    }

    public void validate(HttpServletRequest request) {
        if (!isAllowed(request)) {
            throw new ForbiddenException("Manual login is not allowed from this IP: " + resolveClientIp(request));
        }
    }
}
