import type { AdminTab, MenuItem, Sector } from '../types/app'

// localStorage에 저장할 섹터 순서 키다.
export const STORAGE_KEY = 'cp-dashboard-sector-order'

// 초기 섹터 데이터다.
// 현재는 목업이지만, 이후 백엔드 API 응답으로 대체할 수 있게 구조를 맞춰두었다.
export const initialSectors: Sector[] = [
  {
    id: 'S01',
    title: 'CP 8요소 관리',
    summary: '정책, 점검, 운영 과제를 한 화면에서 관리하는 핵심 섹터입니다.',
    status: '진행률 82%',
    detail: '점검 항목, 개선 요청, 운영 현황을 상세 페이지와 연결합니다.',
    permissions: ['관리자', 'CP 담당자'],
    tone: 'blue',
  },
  {
    id: 'S02',
    title: '공지사항',
    summary: '전사 공지, 긴급 안내, 제도 변경사항을 빠르게 노출합니다.',
    status: '미확인 5건',
    detail: '좌측 메뉴에서 공지 목록과 본문 상세 화면으로 이동합니다.',
    permissions: ['전체 사용자'],
    tone: 'green',
  },
  {
    id: 'S03',
    title: 'Risk Heat Map',
    summary: '리스크 현황을 색상과 구역 기준으로 직관적으로 표시합니다.',
    status: '고위험 3건',
    detail: 'Heat Map과 Red Flag 목록 상세 화면으로 이어지는 섹터입니다.',
    permissions: ['관리자', '감사', 'CP 담당자'],
    tone: 'red',
  },
  {
    id: 'S04',
    title: '주요 성과지표(KPI)',
    summary: '목표 대비 실적, 마감 일정, 부서별 성과를 집계합니다.',
    status: '달성률 91%',
    detail: 'KPI 상세 화면에서 항목별 실적과 추이를 확인하도록 구성합니다.',
    permissions: ['관리자', '부서장', 'CP 담당자'],
    tone: 'orange',
  },
  {
    id: 'S05',
    title: '교육 & 윤리서약',
    summary: '교육 이수율과 윤리서약 현황을 한 번에 관리합니다.',
    status: '미완료 8명',
    detail: '교육 일정, 미이수자, 서약 진행률을 별도 상세 페이지로 분리합니다.',
    permissions: ['관리자', 'HR', 'CP 담당자'],
    tone: 'purple',
  },
  {
    id: 'S06',
    title: '권한관리',
    summary: '권한 그룹과 메뉴 노출, 섹터 배치 권한을 관리합니다.',
    status: '관리자 전용',
    detail: '차후 관리자 페이지와 연결되는 관리 섹터입니다.',
    permissions: ['관리자'],
    tone: 'teal',
  },
]

// 관리자 페이지 탭 정의다.
export const adminTabs: AdminTab[] = [
  {
    id: 'sector',
    title: '섹터 기본정보',
    description: '섹터 기본 정보, 노출 순서, 권한 조건을 관리하는 영역입니다.',
  },
  {
    id: 'notice',
    title: '공지사항',
    description: '공지 등록, 수정, 삭제, 고정 여부를 관리하는 영역입니다.',
  },
  {
    id: 'risk',
    title: 'Risk Heat Map',
    description: '리스크 항목, 심각도, 조치 상태를 관리하는 영역입니다.',
  },
  {
    id: 'kpi',
    title: 'KPI',
    description: 'KPI 지표 기준과 실적, 상태값을 관리하는 영역입니다.',
  },
  {
    id: 'training',
    title: '교육 / 윤리서약',
    description: '교육 일정과 윤리서약 현황 데이터를 관리하는 영역입니다.',
  },
  {
    id: 'auth',
    title: '권한 / 메뉴',
    description: '권한 그룹과 메뉴 노출 규칙을 관리하는 영역입니다.',
  },
]

// 좌측 메뉴 정의다.
// key는 상세 페이지 라우팅 또는 화면 분기 기준으로 계속 사용된다.
export const menuItems: MenuItem[] = [
  { key: 'dashboard', label: '대시보드', description: '메인 섹터 현황과 배치 편집 화면입니다.' },
  { key: 'cp8', label: 'CP 8요소 관리', description: 'CP 8요소 상세 현황과 점검 관리 페이지입니다.' },
  { key: 'notice', label: '공지사항', description: '공지 등록, 조회, 고정 공지 관리 페이지입니다.' },
  { key: 'risk', label: 'Risk Heat Map', description: '리스크 히트맵과 Red Flag 상세 페이지입니다.' },
  { key: 'kpi', label: '주요 성과지표(KPI)', description: 'KPI 항목별 실적과 추이 분석 페이지입니다.' },
  { key: 'training', label: '교육 & 윤리서약', description: '교육 이수율과 윤리서약 현황 상세 페이지입니다.' },
  { key: 'auth', label: '권한관리', description: '권한 그룹, 메뉴 노출, 관리자 권한 설정 페이지입니다.' },
]
