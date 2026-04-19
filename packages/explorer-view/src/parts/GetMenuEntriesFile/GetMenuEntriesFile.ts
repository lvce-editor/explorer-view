import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import {
  menuEntryCopy,
  menuEntryCopyPath,
  menuEntryCopyRelativePath,
  menuEntryCut,
  menuEntryDelete,
  menuEntryOpenContainingFolder,
  menuEntryOpenInIntegratedTerminal,
  menuEntryPaste,
  menuEntryRename,
  menuEntrySelectForCompare,
} from '../GetMenuEntriesShared/GetMenuEntriesShared.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'

export const getMenuEntriesFile = (): readonly MenuEntry[] => {
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
    menuEntrySelectForCompare,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryRename,
    menuEntryDelete,
  ]
}
