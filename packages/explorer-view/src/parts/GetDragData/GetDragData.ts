import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { getDragLabel } from '../GetDragLabel/GetDragLabel.ts'
import { getDragUri } from '../GetDragUri/GetDragUri.ts'

interface DragInfoItem {
  readonly data: string
  readonly type: string
}

export interface IDragInfoNew {
  readonly items: readonly DragInfoItem[]
  readonly label?: string
}

export const getDragData = (items: readonly Pick<ExplorerItem, 'path' | 'type'>[]): IDragInfoNew => {
  const data = items.map(getDragUri).join('\n')
  const dragData: readonly DragInfoItem[] = [
    {
      data,
      type: 'text/uri-list',
    },
    {
      data,
      type: 'text/plain',
    },
  ]
  return {
    items: dragData,
    label: getDragLabel(items.map((item) => item.path)),
  }
}
