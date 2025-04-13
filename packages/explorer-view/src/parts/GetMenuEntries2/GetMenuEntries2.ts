import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import { getMenuEntries } from '../GetMenuEntries/GetMenuEntries.ts'

export const getMenuEntries2 = (uid: number): readonly MenuEntry[] => {
  const { newState } = ExplorerStates.get(uid)
  return getMenuEntries(newState)
}
