import type { ViewMode } from '../../types/app'

// 상단 공통 헤더다.
// 현재 화면 제목, 사용자 정보, 대시보드 전환 버튼을 표시한다.
type TopbarProps = {
  title: string
  userName: string
  userRole: string
  viewMode: ViewMode
  isEditMode: boolean
  onLogout: () => void
  onOpenDashboard: () => void
  onToggleEditMode: () => void
}

export function Topbar({
  title,
  userName,
  userRole,
  viewMode,
  isEditMode,
  onLogout,
  onOpenDashboard,
  onToggleEditMode,
}: TopbarProps) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">CP Dashboard Prototype</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <div className="topbar-user">
          <strong>{userName || '알 수 없는 사용자'}</strong>
          <span>{userRole ? `권한 ${userRole}` : '권한 정보 없음'}</span>
        </div>
        <button
          type="button"
          className={`ghost-button ${viewMode === 'dashboard' ? 'is-active' : ''}`}
          onClick={onOpenDashboard}
        >
          대시보드
        </button>
        {/* 섹터 배치 편집은 대시보드 화면에서만 의미가 있어 조건부로 노출한다. */}
        {viewMode === 'dashboard' ? (
          <button
            type="button"
            className={`ghost-button ${isEditMode ? 'is-active' : ''}`}
            onClick={onToggleEditMode}
          >
            {isEditMode ? '배치 편집 종료' : '섹터 배치 편집'}
          </button>
        ) : null}
        <button type="button" className="ghost-button" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </header>
  )
}
