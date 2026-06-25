package com.company.cpdashboard.common.config;

import com.company.cpdashboard.common.interceptor.SessionCheckInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 공통 웹 설정 클래스다.
 * 로그인 세션이 필요한 API 범위를 여기서 한 번에 관리한다.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final SessionCheckInterceptor sessionCheckInterceptor;

    public WebMvcConfig(SessionCheckInterceptor sessionCheckInterceptor) {
        this.sessionCheckInterceptor = sessionCheckInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionCheckInterceptor)
                .addPathPatterns("/api/**")
                // 로그인 진입, 세션 조회, 개발용 로그인은 예외 경로로 열어둔다.
                .excludePathPatterns(
                        "/api/sso/login",
                        "/api/auth/me",
                        "/api/auth/login-access",
                        "/api/auth/dev-login",
                        "/api/auth/logout",
                        "/actuator/**",
                        "/error"
                );
    }
}
