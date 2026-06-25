import type { MenuItem } from '../types/app'

// 좌측 메뉴의 각 섹터 상세 페이지 공통 골격이다.
// 실제 업무 화면이 정해지기 전까지 배치 구조를 먼저 맞춘다.
type DetailPageProps = {
  activeDetail: MenuItem
}

export function DetailPage({ activeDetail }: DetailPageProps) {
  return (
    <section className="detail-page">
      <div className="detail-hero">
        <p className="eyebrow">Detail Page</p>
        <h2>{activeDetail.label}</h2>
        <p>{activeDetail.description}</p>
      </div>

      <div className="detail-layout">
        <div className="detail-box wide">
          <span>상단 검색 / 기간 / 필터 / 요약 영역</span>
        </div>
        <div className="detail-box">
          <span>좌측 목록 / 카드 / 트리 영역</span>
        </div>
        <div className="detail-box">
          <span>우측 상세 내용 / 편집 / 팝업 연결 영역</span>
        </div>
        <div className="detail-box wide tall">
          <span>하단 메인 테이블 / 차트 / 이력 / 첨부 영역</span>
        </div>
      </div>
    </section>
  )
}
