package com.company.cpdashboard.common.sso;

import com.plantecs.sso.JsonUtil;
import com.plantecs.sso.SSOClient;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

/**
 * plantecs-sso-client.jar를 감싸는 어댑터다.
 * accessToken 기반 SSO 응답에서 사번만 추출하는 역할을 맡는다.
 */
@Component
public class PlantecsSsoClientAdapter {

    public String resolveEmpcd(String accessToken) throws Exception {
        String result = new SSOClient().validSSO(accessToken);
        if (!StringUtils.hasText(result) || !result.contains("\"valid\":true")) {
            throw new IllegalArgumentException("Invalid accessToken");
        }

        String empcd = JsonUtil.getValue(result, "empcd");
        if (!StringUtils.hasText(empcd)) {
            throw new IllegalArgumentException("SSO response does not contain empcd");
        }

        // 기존 시스템과 맞추기 위해 사번은 마지막 6자리 기준으로 통일한다.
        return normalizeEmpcd(empcd);
    }

    private String normalizeEmpcd(String empcd) {
        return empcd.length() > 6 ? empcd.substring(empcd.length() - 6) : empcd;
    }
}
