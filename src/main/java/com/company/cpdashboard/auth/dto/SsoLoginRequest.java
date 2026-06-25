package com.company.cpdashboard.auth.dto;

/**
 * SSO 로그인 진입 시 받을 수 있는 파라미터 묶음이다.
 * accessToken, ssoToken, 사번 직접 전달 케이스를 모두 수용한다.
 */
public class SsoLoginRequest {

    private String accessToken;
    private String ssoToken;
    private String domainName;
    private String empcd;
    private String targetUrl;

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getSsoToken() {
        return ssoToken;
    }

    public void setSsoToken(String ssoToken) {
        this.ssoToken = ssoToken;
    }

    public String getDomainName() {
        return domainName;
    }

    public void setDomainName(String domainName) {
        this.domainName = domainName;
    }

    public String getEmpcd() {
        return empcd;
    }

    public void setEmpcd(String empcd) {
        this.empcd = empcd;
    }

    public String getTargetUrl() {
        return targetUrl;
    }

    public void setTargetUrl(String targetUrl) {
        this.targetUrl = targetUrl;
    }
}
