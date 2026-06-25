import type { FormEvent } from 'react'

// 허용된 IP에서만 보이는 개발용 로그인 화면이다.
// 실제 운영 SSO가 붙기 전까지 사번으로 세션을 생성하는 용도로 사용한다.
type LoginPageProps = {
  clientIp: string
  errorMessage: string | null
  isSubmitting: boolean
  manualLoginAllowed: boolean
  onEmpcdChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  empcd: string
}

export function LoginPage({
  clientIp,
  errorMessage,
  isSubmitting,
  manualLoginAllowed,
  onEmpcdChange,
  onSubmit,
  empcd,
}: LoginPageProps) {
  return (
    <main className="login-shell">
      <section className="login-panel">
        <p className="eyebrow">Manual Access</p>
        <h1>CP Dashboard 로그인</h1>
        <p className="login-description">
          SSO 세션이 없을 때만 사용하는 개발용 로그인 화면입니다. 허용된 IP에서만 접속할 수 있으며
          사번 6자리를 입력하면 해당 사용자 세션으로 진입합니다.
        </p>

        <div className="login-meta">
          <span className={`login-badge ${manualLoginAllowed ? 'is-allowed' : 'is-blocked'}`}>
            {manualLoginAllowed ? '허용된 접속 IP' : '허용되지 않은 접속 IP'}
          </span>
          <span className="login-ip">접속 IP: {clientIp || '확인 중'}</span>
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          {/* 사번은 6자리 숫자만 받도록 화면에서 1차 제한한다. */}
          <label className="login-field">
            <span>사번</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="예: 123456"
              value={empcd}
              onChange={(event) => onEmpcdChange(event.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={!manualLoginAllowed || isSubmitting}
            />
          </label>

          <button
            type="submit"
            className="login-submit"
            disabled={!manualLoginAllowed || isSubmitting || empcd.length !== 6}
          >
            {isSubmitting ? '접속 중...' : '사번으로 접속'}
          </button>
        </form>

        <div className="login-notes">
          <p>SSO 연동 전 임시 접근용으로만 사용합니다.</p>
          <p>운영 전환 시 이 화면은 숨기거나 관리자 IP로만 제한하는 구성이 적합합니다.</p>
        </div>

        {errorMessage ? <p className="login-error">{errorMessage}</p> : null}
      </section>
    </main>
  )
}
