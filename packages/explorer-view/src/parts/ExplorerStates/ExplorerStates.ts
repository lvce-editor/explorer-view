import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const { get, set, wrapCommand, registerCommands, getCommandIds, wrapGetter } = ViewletRegistry.create<ExplorerState>()

export const wrapListItemCommand = <T extends any[]>(
  fn: (state: ExplorerState, ...args: T) => Promise<ExplorerState>
): ((state: ExplorerState, ...args: T) => Promise<ExplorerState>) => {
  return async (state: ExplorerState, ...args: T): Promise<ExplorerState> => {
    const newState = await fn(state, ...args)
    
    // If the items have changed, update visible items and icons
    if (newState.items !== state.items || newState.minLineY !== state.minLineY || newState.maxLineY !== state.maxLineY) {
      const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(newState.minLineY, newState.height, newState.itemHeight, newState.items.length)
      const visible = newState.items.slice(newState.minLineY, maxLineY)
      const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, newState.fileIconCache)
      const visibleExplorerItems = GetVisibleExplorerItems.getVisibleExplorerItems(
        newState.items,
        newState.minLineY,
        maxLineY,
        newState.focusedIndex,
        newState.editingIndex,
        newState.editingType,
        newState.editingValue,
        newState.editingErrorMessage,
        icons,
        newState.useChevrons,
        newState.dropTargets,
        newState.editingIcon,
        newState.cutItems,
        newState.sourceControlIgnoredUris,
      )
      
      return {
        ...newState,
        visibleExplorerItems,
        fileIconCache: newFileIconCache,
        icons,
        maxLineY,
      }
    }
    
    return newState
  }
}
