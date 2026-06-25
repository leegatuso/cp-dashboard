package com.company.cpdashboard.common.sso;

import com.spit.sso.Client;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * ssoClient_swp.jar를 감싸는 어댑터다.
 * ssoToken 기반 레거시 SSO 응답에서 사번을 추출한다.
 */
@Component
public class SpitSsoClientAdapter {

    public String resolveEmpcd(String domainName, String ssoToken) throws Exception {
        String[] results = new Client().validSSO(domainName, "sms.nonssl", ssoToken);
        if (results == null || results.length < 2 || results[0].contains("Unauthenticated")) {
            throw new IllegalArgumentException("Invalid ssoToken");
        }

        String empcd = results[1];
        if (!StringUtils.hasText(empcd)) {
            throw new IllegalArgumentException("SSO response does not contain empcd");
        }

        // 기존 화면과 같은 기준을 쓰기 위해 사번 길이를 6자리로 정규화한다.
        return normalizeEmpcd(empcd);
    }

    private String normalizeEmpcd(String empcd) {
        return empcd.length() > 6 ? empcd.substring(empcd.length() - 6) : empcd;
    }
}
