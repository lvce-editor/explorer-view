import type { DragDataItem } from '../DragDataItem/DragDataItem.ts'

const getDragLabel = (urls: readonly string[]): string => {
  if (urls.length === 1) {
    return urls[0]
  }
  return `${urls.length}`
}

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
  // @ts-ignore
  dragData.label = getDragLabel(urls)
  return dragData
}
