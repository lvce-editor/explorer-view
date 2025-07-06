import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetErrorMessagePosition from '../GetErrorMessagePosition/GetErrorMessagePosition.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const renderItems = (oldState: ExplorerState, newState: ExplorerState): any => {
  const {
    cutItems,
    deltaY,
    dropTargets,
    editingErrorMessage,
    editingIcon,
    editingIndex,
    editingType,
    editingValue,
    focused,
    focusedIndex,
    height,
    icons,
    itemHeight,
    items,
    maxLineY,
    minLineY,
    root,
    useChevrons,
    width,
  } = newState
  const visibleDirents = GetVisibleExplorerItems.getVisibleExplorerItems(
    items,
    minLineY,
    maxLineY,
    focusedIndex,
    editingIndex,
    editingType,
    editingValue,
    editingErrorMessage,
    icons,
    useChevrons,
    dropTargets,
    editingIcon,
    cutItems,
  )
  const isWide = width > 450
  const contentHeight = items.length * itemHeight
  const depth = items[focusedIndex]?.depth || 0
  const indent = 8
  const padding = 10
  const fileIconWidth = 16
  const defaultPaddingLeft = 0
  const chevronSpace = 22
  const { top, left } = GetErrorMessagePosition.getErrorMessagePosition(
    itemHeight,
    focusedIndex,
    minLineY,
    depth,
    indent,
    fileIconWidth,
    padding + defaultPaddingLeft + chevronSpace,
  )

  const dom = GetExplorerVirtualDom.getExplorerVirtualDom(
    visibleDirents,
    focusedIndex,
    root,
    isWide,
    focused,
    dropTargets,
    height,
    contentHeight,
    deltaY,
    editingErrorMessage,
    top,
    left,
  )
  return ['Viewlet.setDom2', dom]
}
