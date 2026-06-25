import type { DragEvent } from 'react'
import type { Sector } from '../../types/app'

// 대시보드의 개별 섹터 카드 UI다.
// 드래그 상태와 드롭 대상 여부를 받아 같은 카드 컴포넌트로 재사용한다.
type SectorCardProps = {
  isDragging: boolean
  isDropTarget: boolean
  isEditMode: boolean
  sector: Sector
  onDragEnd: () => void
  onDragOver: (event: DragEvent<HTMLElement>) => void
  onDragStart: () => void
  onDrop: () => void
}

export function SectorCard({
  isDragging,
  isDropTarget,
  isEditMode,
  sector,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
}: SectorCardProps) {
  return (
    <article
      // 편집 모드일 때만 브라우저 drag 이벤트를 활성화한다.
      className={`sector-card tone-${sector.tone} ${isDragging ? 'dragging' : ''} ${isDropTarget ? 'drop-target' : ''}`}
      draggable={isEditMode}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className="sector-head">
        <span className="sector-id">{sector.id}</span>
        <span className="sector-status">{sector.status}</span>
      </div>

      <div className="sector-body">
        <h3>{sector.title}</h3>
        <p>{sector.summary}</p>
        <div className="sector-meta">
          <p>{sector.detail}</p>
          <div className="permission-list">
            {sector.permissions.map((permission) => (
              <span key={permission} className="permission-chip">
                {permission}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="sector-actions">
        <button type="button" className="ghost-button small">
          상세 보기
        </button>
        <span className="drag-hint">
          {isEditMode ? '드래그해서 위치 변경' : '고정 크기 6칸 기준'}
        </span>
      </div>
    </article>
  )
}
