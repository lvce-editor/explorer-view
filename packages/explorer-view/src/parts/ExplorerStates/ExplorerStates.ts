import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const { get, set, wrapCommand, registerCommands, getCommandIds, wrapGetter } = ViewletRegistry.create<ExplorerState>()

export const wrapListItemCommand = <T extends any[]>(
  fn: (state: ExplorerState, ...args: T) => Promise<ExplorerState>,
): ((id: number, ...args: T) => Promise<void>) => {
  const wrappedCommand = async (id: number, ...args: T): Promise<void> => {
    const { newState } = get(id)
    const updatedState = await fn(newState, ...args)
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
    const intermediate = get(id)
    set(id, intermediate.oldState, updatedState)
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
    const finalState: ExplorerState = {
      ...updatedState,
      visibleExplorerItems,
      fileIconCache: newFileIconCache,
      icons,
      maxLineY,
    }
    const intermediate2 = get(id)
    set(id, intermediate2.oldState, finalState)
  }
  return wrappedCommand
}
