package com.company.cpdashboard.common.session;

/**
 * 세션에 저장되는 로그인 사용자 정보 객체다.
 * 프론트의 사용자 표시, 권한 분기, 부서 정보 표시에 사용된다.
 */
public class LoginUser {

    private String empId;
    private String userId;
    private String orgId;
    private String empcd;
    private String hname;
    private String deptcd;
    private String deptcdDisp;
    private String jikckcdDisp;
    private String jikgubcdDisp;
    private String workArea;
    private String mngArea;
    private String supId;
    private String authority;

    public String getEmpId() {
        return empId;
    }

    public void setEmpId(String empId) {
        this.empId = empId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getEmpcd() {
        return empcd;
    }

    public void setEmpcd(String empcd) {
        this.empcd = empcd;
    }

    public String getHname() {
        return hname;
    }

    public void setHname(String hname) {
        this.hname = hname;
    }

    public String getDeptcd() {
        return deptcd;
    }

    public void setDeptcd(String deptcd) {
        this.deptcd = deptcd;
    }

    public String getDeptcdDisp() {
        return deptcdDisp;
    }

    public void setDeptcdDisp(String deptcdDisp) {
        this.deptcdDisp = deptcdDisp;
    }

    public String getJikckcdDisp() {
        return jikckcdDisp;
    }

    public void setJikckcdDisp(String jikckcdDisp) {
        this.jikckcdDisp = jikckcdDisp;
    }

    public String getJikgubcdDisp() {
        return jikgubcdDisp;
    }

    public void setJikgubcdDisp(String jikgubcdDisp) {
        this.jikgubcdDisp = jikgubcdDisp;
    }

    public String getWorkArea() {
        return workArea;
    }

    public void setWorkArea(String workArea) {
        this.workArea = workArea;
    }

    public String getMngArea() {
        return mngArea;
    }

    public void setMngArea(String mngArea) {
        this.mngArea = mngArea;
    }

    public String getSupId() {
        return supId;
    }

    public void setSupId(String supId) {
        this.supId = supId;
    }

    public String getAuthority() {
        return authority;
    }

    public void setAuthority(String authority) {
        this.authority = authority;
    }
}
