import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import { allEntries } from '../GetMenuEntriesShared/GetMenuEntriesShared.ts'

export const getMenuEntriesDirectory = (): readonly MenuEntry[] => {
  return allEntries
}