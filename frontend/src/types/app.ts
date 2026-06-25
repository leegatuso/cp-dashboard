// 섹터 상단 강조색을 통일하기 위한 UI 타입이다.
export type SectorTone = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'teal'

// 본문에 어떤 화면을 보여줄지 구분하는 앱 레벨 상태다.
export type ViewMode = 'dashboard' | 'admin' | 'detail'

// 좌측 메뉴 및 상세 화면을 분기하는 고정 key 목록이다.
export type MenuKey =
  | 'dashboard'
  | 'cp8'
  | 'notice'
  | 'risk'
  | 'kpi'
  | 'training'
  | 'auth'

// 메인 대시보드 카드 한 칸에 필요한 데이터 구조다.
export type Sector = {
  id: string
  title: string
  summary: string
  status: string
  detail: string
  permissions: string[]
  tone: SectorTone
}

// 관리자 페이지 상단 탭 정의에 사용한다.
export type AdminTab = {
  id: string
  title: string
  description: string
}

// 좌측 메뉴 항목 정의에 사용한다.
export type MenuItem = {
  key: MenuKey
  label: string
  description: string
}
