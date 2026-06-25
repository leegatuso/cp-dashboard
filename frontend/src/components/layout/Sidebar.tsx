import type { MenuItem, MenuKey, ViewMode } from '../../types/app'

// 좌측 고정 메뉴 영역이다.
// 현재 사용자 정보와 메뉴 활성 상태를 함께 보여준다.
type SidebarProps = {
  activeMenu: MenuKey
  menuItems: MenuItem[]
  userDepartment: string
  userName: string
  viewMode: ViewMode
  onAdminClick: () => void
  onMenuClick: (menuKey: MenuKey) => void
}

export function Sidebar({
  activeMenu,
  menuItems,
  userDepartment,
  userName,
  viewMode,
  onAdminClick,
  onMenuClick,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">CP</div>
        <div>
          <strong>PLANTEC</strong>
          <p>Compliance Management</p>
        </div>
      </div>

      <nav className="side-nav">
        {/* menuItems는 실제 상세 페이지 메뉴와 1:1로 연결된다. */}
        {menuItems.map((item, index) => (
          <button
            key={item.key}
            type="button"
            className={`nav-item ${activeMenu === item.key && viewMode !== 'admin' ? 'active' : ''}`}
            onClick={() => onMenuClick(item.key)}
          >
            <span className="nav-index">{String(index + 1).padStart(2, '0')}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <button
          type="button"
          className={`admin-entry ${viewMode === 'admin' ? 'active' : ''}`}
          onClick={onAdminClick}
        >
          관리자 페이지
        </button>
        <p>{userName ? `${userName} ${userDepartment ? `· ${userDepartment}` : ''}` : '사용자 정보 없음'}</p>
        <p>섹터 노출과 배치 순서는 권한 및 사용자 설정에 따라 달라집니다.</p>
      </div>
    </aside>
  )
}
