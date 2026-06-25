import type { DragEvent, FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { fetchCurrentUser, fetchLoginAccess, loginWithEmpcd, loginWithSso, logout } from './api/auth'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { STORAGE_KEY, adminTabs, initialSectors, menuItems } from './data/mock'
import { AdminPage } from './pages/AdminPage'
import { DashboardPage } from './pages/DashboardPage'
import { DetailPage } from './pages/DetailPage'
import { LoginPage } from './pages/LoginPage'
import type { LoginAccessInfo, LoginUser } from './types/auth'
import type { MenuKey, ViewMode } from './types/app'
import { reorderSectors, sortSectorsBySavedOrder } from './utils/sectorOrder'

// 앱 전체 진입점이다.
// 인증 상태 확인, 화면 전환, 대시보드 배치 편집 상태를 한 곳에서 관리한다.
type AuthState = 'loading' | 'authenticated' | 'manual-login' | 'closing'

function App() {
  // authState는 현재 사용자가 어떤 진입 단계에 있는지 구분할 때 사용한다.
  const [authState, setAuthState] = useState<AuthState>('loading')
  const [currentUser, setCurrentUser] = useState<LoginUser | null>(null)
  const [loginAccessInfo, setLoginAccessInfo] = useState<LoginAccessInfo | null>(null)
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null)
  const [loginEmpcd, setLoginEmpcd] = useState('')
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false)

  // viewMode와 activeMenu는 좌측 메뉴와 본문 화면을 맞춰 움직이기 위한 상태다.
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [activeMenu, setActiveMenu] = useState<MenuKey>('dashboard')
  const [activeAdminTab, setActiveAdminTab] = useState(adminTabs[0].id)
  const [sectors, setSectors] = useState(() => sortSectorsBySavedOrder(initialSectors))
  const [isEditMode, setIsEditMode] = useState(false)
  const [draggingSectorId, setDraggingSectorId] = useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = useState<string | null>(null)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sectors.map((sector) => sector.id)))
  }, [sectors])

  useEffect(() => {
    // 최초 접속 시 기존 세션, SSO 파라미터, 수동 로그인 허용 여부 순서로 확인한다.
    const bootstrapAuth = async () => {
      try {
        const sessionUser = await fetchCurrentUser()
        setCurrentUser(sessionUser)
        setAuthState('authenticated')
        return
      } catch {
        // Fall through to SSO token login or manual login access check.
      }

      const params = new URLSearchParams(window.location.search)
      const ssoParams = new URLSearchParams()

      // 외부 SSO 진입 시 URL에 붙는 값을 그대로 백엔드 로그인 API로 넘긴다.
      for (const key of ['accessToken', 'ssoToken', 'domainName', 'empcd']) {
        const value = params.get(key)
        if (value) {
          ssoParams.set(key, value)
        }
      }

      if (ssoParams.size > 0) {
        try {
          const ssoUser = await loginWithSso(ssoParams)
          setCurrentUser(ssoUser)
          setAuthState('authenticated')
          window.history.replaceState({}, '', window.location.pathname)
          return
        } catch (error) {
          setLoginErrorMessage(
            error instanceof Error ? error.message : 'SSO 로그인 처리에 실패했습니다.',
          )
        }
      }

      try {
        const accessInfo = await fetchLoginAccess()
        setLoginAccessInfo(accessInfo)

        if (accessInfo.allowed) {
          setAuthState('manual-login')
          return
        }
      } catch (error) {
        setLoginErrorMessage(
          error instanceof Error ? error.message : '로그인 접근 정책을 확인하지 못했습니다.',
        )
      }

      setAuthState('closing')
      window.setTimeout(() => {
        window.open('', '_self')
        window.close()
      }, 200)
    }

    void bootstrapAuth()
  }, [])

  const activeAdminSection = adminTabs.find((tab) => tab.id === activeAdminTab) ?? adminTabs[0]
  const activeDetail = useMemo(
    () => menuItems.find((item) => item.key === activeMenu) ?? menuItems[0],
    [activeMenu],
  )

  // 수동 로그인 화면에서 사번 6자리를 받아 개발용 세션을 생성한다.
  const handleManualLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginErrorMessage(null)
    setIsLoginSubmitting(true)

    try {
      const user = await loginWithEmpcd(loginEmpcd)
      setCurrentUser(user)
      setAuthState('authenticated')
      setLoginEmpcd('')
    } catch (error) {
      setLoginErrorMessage(
        error instanceof Error ? error.message : '사번 로그인 처리 중 오류가 발생했습니다.',
      )
    } finally {
      setIsLoginSubmitting(false)
    }
  }

  // 로그아웃 후에는 허용 IP 여부에 따라 로그인 화면으로 돌리거나 종료 상태로 보낸다.
  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Keep UI transition even if logout response fails.
    }

    setCurrentUser(null)
    setAuthState(loginAccessInfo?.allowed ? 'manual-login' : 'closing')
    setViewMode('dashboard')
    setActiveMenu('dashboard')
    setIsEditMode(false)
    setDraggingSectorId(null)
    setDropTargetId(null)

    if (!loginAccessInfo?.allowed) {
      window.setTimeout(() => {
        window.open('', '_self')
        window.close()
      }, 200)
    }
  }

  // 배치 편집 종료 시 드래그 중인 섹터 상태를 반드시 초기화한다.
  const toggleEditMode = () => {
    setIsEditMode((current) => {
      const next = !current
      if (!next) {
        setDraggingSectorId(null)
        setDropTargetId(null)
      }
      return next
    })
  }

  const openDashboard = () => {
    setViewMode('dashboard')
    setActiveMenu('dashboard')
  }

  // 관리자 화면은 좌측 메뉴 하단 고정 진입점에서만 열리게 분리했다.
  const openAdmin = () => {
    setViewMode('admin')
    setActiveMenu('dashboard')
    setIsEditMode(false)
    setDraggingSectorId(null)
    setDropTargetId(null)
  }

  const handleMenuClick = (menuKey: MenuKey) => {
    setActiveMenu(menuKey)
    setIsEditMode(false)
    setDraggingSectorId(null)
    setDropTargetId(null)

    if (menuKey === 'dashboard') {
      setViewMode('dashboard')
      return
    }

    setViewMode('detail')
  }

  // draggingSectorId는 현재 끌고 있는 카드, dropTargetId는 놓일 위치를 표시할 때 사용한다.
  const handleDragStart = (sectorId: string) => {
    if (!isEditMode || viewMode !== 'dashboard') return
    setDraggingSectorId(sectorId)
    setDropTargetId(sectorId)
  }

  const handleDragOver = (event: DragEvent<HTMLElement>, sectorId: string) => {
    if (!isEditMode || !draggingSectorId || viewMode !== 'dashboard') return
    event.preventDefault()
    if (dropTargetId !== sectorId) setDropTargetId(sectorId)
  }

  const handleDrop = (sectorId: string) => {
    if (!isEditMode || !draggingSectorId || viewMode !== 'dashboard') return
    setSectors((current) => reorderSectors(current, draggingSectorId, sectorId))
    setDraggingSectorId(null)
    setDropTargetId(null)
  }

  const handleDragEnd = () => {
    setDraggingSectorId(null)
    setDropTargetId(null)
  }

  if (authState === 'loading') {
    return (
      <main className="auth-status-shell">
        <section className="auth-status-card">
          <p className="eyebrow">Authentication</p>
          <h1>사용자 세션 확인 중</h1>
          <p>메인 페이지 진입 전 SSO와 세션 정보를 확인하고 있습니다.</p>
        </section>
      </main>
    )
  }

  if (authState === 'manual-login') {
    return (
      <LoginPage
        clientIp={loginAccessInfo?.clientIp ?? ''}
        errorMessage={loginErrorMessage}
        isSubmitting={isLoginSubmitting}
        manualLoginAllowed={Boolean(loginAccessInfo?.allowed)}
        onEmpcdChange={setLoginEmpcd}
        onSubmit={handleManualLoginSubmit}
        empcd={loginEmpcd}
      />
    )
  }

  if (authState === 'closing') {
    return (
      <main className="auth-status-shell">
        <section className="auth-status-card">
          <p className="eyebrow">Access Denied</p>
          <h1>허용되지 않은 접근입니다</h1>
          <p>허용된 IP가 아니거나 세션을 생성할 수 없어 창을 종료합니다.</p>
          {loginErrorMessage ? <p className="auth-status-error">{loginErrorMessage}</p> : null}
        </section>
      </main>
    )
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeMenu={activeMenu}
        menuItems={menuItems}
        userName={currentUser?.hname ?? ''}
        userDepartment={currentUser?.deptcdDisp || currentUser?.deptcd || ''}
        viewMode={viewMode}
        onAdminClick={openAdmin}
        onMenuClick={handleMenuClick}
      />

      <main className="workspace">
        <Topbar
          title={
            viewMode === 'dashboard'
              ? 'PLANTEC CP Main Dashboard'
              : viewMode === 'admin'
                ? '관리자 페이지'
                : activeDetail.label
          }
          userName={currentUser?.hname ?? ''}
          userRole={currentUser?.authority ?? ''}
          viewMode={viewMode}
          isEditMode={isEditMode}
          onLogout={handleLogout}
          onOpenDashboard={openDashboard}
          onToggleEditMode={toggleEditMode}
        />

        {viewMode === 'dashboard' ? (
          <DashboardPage
            draggingSectorId={draggingSectorId}
            dropTargetId={dropTargetId}
            isEditMode={isEditMode}
            sectors={sectors}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
          />
        ) : null}

        {viewMode === 'admin' ? (
          <AdminPage
            activeAdminSection={activeAdminSection}
            activeAdminTab={activeAdminTab}
            adminTabs={adminTabs}
            onTabChange={setActiveAdminTab}
          />
        ) : null}

        {viewMode === 'detail' ? <DetailPage activeDetail={activeDetail} /> : null}
      </main>
    </div>
  )
}

export default App
