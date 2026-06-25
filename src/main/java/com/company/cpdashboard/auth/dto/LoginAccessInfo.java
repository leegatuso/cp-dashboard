package com.company.cpdashboard.auth.dto;

/**
 * 현재 접속 IP가 개발용 로그인 화면 접근 대상인지 알려주는 응답 타입이다.
 */
public record LoginAccessInfo(boolean allowed, String clientIp) {
}
