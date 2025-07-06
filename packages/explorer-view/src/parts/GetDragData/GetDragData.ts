import type { DragDataItem } from '../DragDataItem/DragDataItem.ts'

const getDragLabel = (urls: readonly string[]): string => {
  if (urls.length === 1) {
    return urls[0]
  }
  return `${urls.length}`
}

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
      type: 'text/uri-list',
      data,
    },
    {
      type: 'text/plain',
      data,
    },
  ]
  // @ts-ignore
  dragData.label = getDragLabel(urls)
  return dragData
}
