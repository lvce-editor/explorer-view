import { ViewletCommand } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'

export const renderItems = (oldState: ExplorerState, newState: ExplorerState): any => {
  const { deltaY, dropTargets, editingErrorMessage, focused, focusedIndex, height, itemHeight, items, root, width } = newState
  const visibleDirents = newState.visibleExplorerItems
  const isWide = width > 450
  const contentHeight = items.length * itemHeight
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
  )
  return [ViewletCommand.SetDom2, dom]
}
