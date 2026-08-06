import { ensureUri } from '../EnsureUris/EnsureUris.ts'
import { getDragLabel } from '../GetDragLabel/GetDragLabel.ts'

interface DragInfoItem {
  readonly data: string
  readonly type: string
}

export interface IDragInfoNew {
  readonly items: readonly DragInfoItem[]
  readonly label?: string
}

export const getDragData = (urls: readonly string[]): IDragInfoNew => {
  const data = urls.map(ensureUri).join('\n')
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
    label: getDragLabel(urls),
  }
}
