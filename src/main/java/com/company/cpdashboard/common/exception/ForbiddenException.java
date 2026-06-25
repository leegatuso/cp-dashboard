package com.company.cpdashboard.common.exception;

/**
 * 접근 자체가 허용되지 않을 때 사용하는 예외다.
 * 현재는 개발용 수동 로그인 IP 제한에서 사용한다.
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }
}
