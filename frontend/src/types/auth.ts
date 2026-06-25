// 백엔드 세션에 저장된 로그인 사용자의 기본 정보 구조다.
export type LoginUser = {
  empId: string
  userId: string
  orgId: string
  empcd: string
  hname: string
  deptcd: string
  deptcdDisp: string
  jikckcdDisp: string
  jikgubcdDisp: string
  workArea: string
  mngArea: string
  supId: string
  authority: string
}

// Spring Boot 공통 응답 포맷과 맞추기 위한 타입이다.
export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

// 수동 로그인 허용 IP 여부 확인 API의 응답 구조다.
export type LoginAccessInfo = {
  allowed: boolean
  clientIp: string
}
