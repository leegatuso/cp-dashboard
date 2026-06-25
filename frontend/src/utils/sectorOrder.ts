import { STORAGE_KEY } from '../data/mock'
import type { Sector } from '../types/app'

// 저장된 섹터 순서를 읽어 초기 화면 순서를 복원한다.
export function sortSectorsBySavedOrder(items: Sector[]) {
  if (typeof window === 'undefined') return items

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return items

  try {
    const order = JSON.parse(saved) as string[]
    const orderMap = new Map(order.map((id, index) => [id, index]))

    return [...items].sort((a, b) => {
      const aIndex = orderMap.get(a.id)
      const bIndex = orderMap.get(b.id)
      if (aIndex === undefined && bIndex === undefined) return 0
      if (aIndex === undefined) return 1
      if (bIndex === undefined) return -1
      return aIndex - bIndex
    })
  } catch {
    return items
  }
}

// 드래그한 섹터를 목표 위치로 옮길 때 사용하는 순서 재배치 유틸이다.
export function reorderSectors(items: Sector[], fromId: string, toId: string) {
  const next = [...items]
  const fromIndex = next.findIndex((item) => item.id === fromId)
  const toIndex = next.findIndex((item) => item.id === toId)

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return items

  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}
