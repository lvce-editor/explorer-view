import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const { get, set, wrapCommand, registerCommands, getCommandIds, wrapGetter } = ViewletRegistry.create<ExplorerState>()

export const wrapListItemCommand = <T extends any[]>(
  fn: (state: ExplorerState, ...args: T) => Promise<ExplorerState>,
): ((state: ExplorerState, ...args: T) => Promise<ExplorerState>) => {
  const wrappedCommand = async (state: ExplorerState, ...args: T): Promise<ExplorerState> => {
    const newState = await fn(state, ...args)
    const {
      items,
      minLineY,
      focusedIndex,
      editingIndex,
      editingType,
      editingValue,
      editingErrorMessage,
      useChevrons,
      dropTargets,
      editingIcon,
      cutItems,
      sourceControlIgnoredUris,
      height,
      itemHeight,
      fileIconCache,
    } = newState
    const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, items.length)
    const visible = items.slice(minLineY, maxLineY)
    const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
    const visibleExplorerItems = GetVisibleExplorerItems.getVisibleExplorerItems(
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
      sourceControlIgnoredUris,
    )

    return {
      ...newState,
      visibleExplorerItems,
      fileIconCache: newFileIconCache,
      icons,
      maxLineY,
    }
  }
  return wrappedCommand
}
