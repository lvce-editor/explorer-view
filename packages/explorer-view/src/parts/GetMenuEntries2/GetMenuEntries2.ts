import { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getMenuEntries } from '../GetMenuEntries/GetMenuEntries.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'

export const getMenuEntries2 = (state: ExplorerState): readonly MenuEntry[] => {
  return getMenuEntries(state)
}
