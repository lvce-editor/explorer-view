import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetErrorMessagePosition from '../GetErrorMessagePosition/GetErrorMessagePosition.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'

export const renderItems = (oldState: ExplorerState, newState: ExplorerState): any => {
  const { deltaY, dropTargets, editingErrorMessage, focused, focusedIndex, height, itemHeight, items, minLineY, root, width } = newState
  const visibleDirents = newState.visibleExplorerItems
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
    width,
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
  return [ViewletCommand.SetDom2, dom]
}
