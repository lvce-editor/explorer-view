import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import { allEntries } from '../GetMenuEntriesShared/GetMenuEntriesShared.ts'

export const getMenuEntriesDefault = (): readonly MenuEntry[] => {
  return allEntries
}