import type { DragDataItem } from '../DragDataItem/DragDataItem.ts'

export const getDragData = (urls: readonly string[]): readonly DragDataItem[] => {
  const data = urls.join('\n')
  // TODO send selected urls
  const dragData = [
    {
      type: 'text/plain',
      data,
    },
    {
      type: 'text/uri-list',
      data,
    },
  ]
  return dragData
}
