package com.company.cpdashboard.auth.mapper;

import com.company.cpdashboard.auth.dto.AuthUserLookup;
import com.company.cpdashboard.common.session.LoginUser;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

/**
 * 인증 관련 사용자 조회 Mapper다.
 * 기존 레거시 SSO 흐름에서 사용하던 사용자 매핑 SQL을 옮겨왔다.
 */
@Mapper
public interface AuthMapper {

    // 사번으로 내부 시스템 USER_ID를 찾는다.
    String getUserId(@Param("empcd") String empcd);

    // USER_ID와 사번 기준으로 화면에서 쓸 로그인 사용자 정보를 조회한다.
    LoginUser getLoginUser(AuthUserLookup request);
}
