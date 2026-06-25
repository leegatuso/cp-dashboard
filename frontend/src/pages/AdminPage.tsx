import type { AdminTab } from '../types/app'

// 관리자 탭 화면의 공통 뼈대다.
// 실제 CRUD 폼이 들어오기 전까지 영역 배치를 먼저 잡아둔다.
type AdminPageProps = {
  activeAdminSection: AdminTab
  activeAdminTab: string
  adminTabs: AdminTab[]
  onTabChange: (tabId: string) => void
}

export function AdminPage({
  activeAdminSection,
  activeAdminTab,
  adminTabs,
  onTabChange,
}: AdminPageProps) {
  return (
    <section className="admin-panel">
      <div className="admin-tabs">
        {/* 어떤 탭이 선택되었는지는 상위 App 상태에서 관리한다. */}
        {adminTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`admin-tab ${activeAdminTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="admin-canvas">
        <div className="admin-canvas-head">
          <div>
            <p className="eyebrow">Admin Section</p>
            <h3>{activeAdminSection.title}</h3>
          </div>
          <div className="admin-canvas-actions">
            <button type="button" className="ghost-button small">
              조회
            </button>
            <button type="button" className="ghost-button small">
              등록
            </button>
            <button type="button" className="ghost-button small">
              수정
            </button>
            <button type="button" className="ghost-button small">
              삭제
            </button>
          </div>
        </div>

        <p className="admin-description">{activeAdminSection.description}</p>

        <div className="admin-placeholder">
          <div className="placeholder-box wide">
            <span>상단 검색 / 필터 / 등록 버튼 영역</span>
          </div>
          <div className="placeholder-grid">
            <div className="placeholder-box">
              <span>좌측 목록 / 트리 / 요약 영역</span>
            </div>
            <div className="placeholder-box">
              <span>우측 상세 / 편집 폼 영역</span>
            </div>
          </div>
          <div className="placeholder-box wide">
            <span>하단 테이블 / 로그 / 첨부 / 이력 영역</span>
          </div>
        </div>
      </div>
    </section>
  )
}
