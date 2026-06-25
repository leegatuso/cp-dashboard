package com.company.cpdashboard.common.exception;

/**
 * 세션이 없거나 로그인 상태가 아닌 경우에 사용하는 예외다.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
