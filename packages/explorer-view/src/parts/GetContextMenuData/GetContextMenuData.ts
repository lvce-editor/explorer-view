import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { getMenuEntries } from '../GetMenuEntries/GetMenuEntries.ts'

interface ContextMenuData {
  readonly applicationId: string | undefined
  readonly context: { readonly isDirectory: boolean; readonly uri: string }
  readonly entries: readonly MenuEntry[]
}

export const getContextMenuData = (state: ExplorerState): ContextMenuData => {
  const { applicationId, focusedIndex, items, root } = state
  const item = items[focusedIndex]
  return {
    applicationId,
    context: {
      isDirectory: item ? item.type !== DirentType.File : true,
      uri: item?.uri || root,
    },
    entries: getMenuEntries(state),
  }
}
