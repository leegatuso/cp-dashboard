package com.company.cpdashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot 백엔드 진입점이다.
 * 인증, 세션, DB, 공통 API를 이 애플리케이션에서 함께 실행한다.
 */
@SpringBootApplication
public class CpDashboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(CpDashboardApplication.class, args);
    }

}
