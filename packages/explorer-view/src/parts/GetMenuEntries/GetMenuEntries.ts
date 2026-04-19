import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { getMenuEntriesDefault } from '../GetMenuEntriesDefault/GetMenuEntriesDefault.ts'
import { getMenuEntriesDirectory } from '../GetMenuEntriesDirectory/GetMenuEntriesDirectory.ts'
import { getMenuEntriesFile } from '../GetMenuEntriesFile/GetMenuEntriesFile.ts'
import { getMenuEntriesFileCompareWithSelected } from '../GetMenuEntriesFileCompareWithSelected/GetMenuEntriesFileCompareWithSelected.ts'
import { getMenuEntriesFocusedDirent } from '../GetMenuEntriesFocusedDirent/GetMenuEntriesFocusedDirent.ts'
import { getMenuEntriesRoot } from '../GetMenuEntriesRoot/GetMenuEntriesRoot.ts'

export const getMenuEntries = (state: ExplorerState): readonly MenuEntry[] => {
  const focusedDirent = getMenuEntriesFocusedDirent(state)
  if (!focusedDirent) {
    return getMenuEntriesRoot(state.root)
  }
  switch (focusedDirent.type) {
    case DirentType.Directory:
      return getMenuEntriesDirectory()
    case DirentType.File:
      if (state.compareSourceUri && state.compareSourceUri !== focusedDirent.path) {
        return getMenuEntriesFileCompareWithSelected()
      }
      return getMenuEntriesFile()
    default:
      return getMenuEntriesDefault()
  }
}
