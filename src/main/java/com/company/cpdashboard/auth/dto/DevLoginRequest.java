package com.company.cpdashboard.auth.dto;

/**
 * 개발용 수동 로그인 요청 DTO다.
 * 프론트 로그인 화면에서 입력한 사번이 여기에 매핑된다.
 */
public class DevLoginRequest {

    private String empcd;

    public String getEmpcd() {
        return empcd;
    }

    public void setEmpcd(String empcd) {
        this.empcd = empcd;
    }
}
