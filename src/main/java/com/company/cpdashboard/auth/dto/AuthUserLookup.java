package com.company.cpdashboard.auth.dto;

/**
 * 사용자 조회용 MyBatis 파라미터 객체다.
 * 내부 사용자 ID와 사번을 함께 전달할 때 사용한다.
 */
public class AuthUserLookup {

    private String userId;
    private String empcd;

    public AuthUserLookup() {
    }

    public AuthUserLookup(String userId, String empcd) {
        this.userId = userId;
        this.empcd = empcd;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmpcd() {
        return empcd;
    }

    public void setEmpcd(String empcd) {
        this.empcd = empcd;
    }
}
