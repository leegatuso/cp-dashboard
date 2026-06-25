import type { DragEvent } from 'react'
import { SectorCard } from '../components/dashboard/SectorCard'
import type { Sector } from '../types/app'

// 메인 대시보드 섹터 그리드 영역이다.
// 섹터의 실제 순서와 드래그 상태는 상위 App에서 주입받는다.
type DashboardPageProps = {
  draggingSectorId: string | null
  dropTargetId: string | null
  isEditMode: boolean
  sectors: Sector[]
  onDragEnd: () => void
  onDragOver: (event: DragEvent<HTMLElement>, sectorId: string) => void
  onDragStart: (sectorId: string) => void
  onDrop: (sectorId: string) => void
}

export function DashboardPage({
  draggingSectorId,
  dropTargetId,
  isEditMode,
  sectors,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
}: DashboardPageProps) {
  return (
    <section className={`sector-grid ${isEditMode ? 'edit-mode' : ''}`}>
      {/* 섹터 개수가 늘어나도 동일한 카드 컴포넌트로 반복 렌더링한다. */}
      {sectors.map((sector) => (
        <SectorCard
          key={sector.id}
          isDragging={draggingSectorId === sector.id}
          isDropTarget={dropTargetId === sector.id && draggingSectorId !== sector.id}
          isEditMode={isEditMode}
          sector={sector}
          onDragEnd={onDragEnd}
          onDragOver={(event) => onDragOver(event, sector.id)}
          onDragStart={() => onDragStart(sector.id)}
          onDrop={() => onDrop(sector.id)}
        />
      ))}
    </section>
  )
}
