import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import {
  menuEntryCompareWithSelected,
  menuEntryCopy,
  menuEntryCopyPath,
  menuEntryCopyRelativePath,
  menuEntryCut,
  menuEntryDelete,
  menuEntryOpenContainingFolder,
  menuEntryOpenInIntegratedTerminal,
  menuEntryPaste,
  menuEntryRename,
} from '../GetMenuEntriesShared/GetMenuEntriesShared.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'

export const getMenuEntriesFileCompareWithSelected = (): readonly MenuEntry[] => {
  return [
    menuEntryOpenContainingFolder,
    menuEntryOpenInIntegratedTerminal,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCut,
    menuEntryCopy,
    menuEntryPaste,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCopyPath,
    menuEntryCopyRelativePath,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCompareWithSelected,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryRename,
    menuEntryDelete,
  ]
}
