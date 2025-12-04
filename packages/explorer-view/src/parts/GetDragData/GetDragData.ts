import type { DragDataItem } from '../DragDataItem/DragDataItem.ts'
import { getDragLabel } from '../GetDragLabel/GetDragLabel.ts'

const toUri = (path: string): string => {
  if (path.startsWith('file://')) {
    return path
  }
  return 'file://' + path
}

export const getDragData = (urls: readonly string[]): readonly DragDataItem[] => {
  const data = urls.map(toUri).join('\n')
  const dragData = [
    {
      data,
      type: 'text/uri-list',
    },
    {
      data,
      type: 'text/plain',
    },
  ]
  // @ts-ignore
  dragData.label = getDragLabel(urls)
  return dragData
}
