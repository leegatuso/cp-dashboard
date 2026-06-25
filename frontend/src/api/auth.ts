import type { ApiResponse, LoginAccessInfo, LoginUser } from '../types/auth'

// 백엔드 공통 응답 구조를 프론트 타입으로 안전하게 변환한다.
async function parseResponse<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResponse<T>

  if (!response.ok || !result.success) {
    throw new Error(result.message || '요청 처리에 실패했습니다.')
  }

  return result.data
}

// 현재 브라우저 세션에 저장된 로그인 사용자를 조회한다.
export async function fetchCurrentUser() {
  const response = await fetch('/api/auth/me', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  return parseResponse<LoginUser>(response)
}

// 수동 로그인 페이지를 열 수 있는 IP인지 확인할 때 사용한다.
export async function fetchLoginAccess() {
  const response = await fetch('/api/auth/login-access', {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  return parseResponse<LoginAccessInfo>(response)
}

// URL로 전달받은 SSO 파라미터를 그대로 백엔드 로그인 API에 위임한다.
export async function loginWithSso(params: URLSearchParams) {
  const response = await fetch(`/api/sso/login?${params.toString()}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  return parseResponse<LoginUser>(response)
}

// 개발 단계에서는 사번으로 직접 세션을 만들기 위해 이 API를 사용한다.
export async function loginWithEmpcd(empcd: string) {
  const response = await fetch('/api/auth/dev-login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ empcd }),
  })

  return parseResponse<LoginUser>(response)
}

// 로그아웃 시 서버 세션을 함께 정리한다.
export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
    },
  })

  return parseResponse<null>(response)
}
