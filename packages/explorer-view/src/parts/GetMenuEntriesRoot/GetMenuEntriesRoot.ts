import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import {
  menuEntryCopyPath,
  menuEntryCopyRelativePath,
  menuEntryNewFile,
  menuEntryNewFolder,
  menuEntryOpenContainingFolder,
  menuEntryOpenInIntegratedTerminal,
  menuEntryPaste,
  menuEntryRemoveFolderFromWorkspace,
} from '../GetMenuEntriesShared/GetMenuEntriesShared.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'

export const getMenuEntriesRoot = (root: string): readonly MenuEntry[] => {
  const entries: MenuEntry[] = [
    menuEntryNewFile,
    menuEntryNewFolder,
    menuEntryOpenContainingFolder,
    menuEntryOpenInIntegratedTerminal,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryPaste,
    MenuEntrySeparator.menuEntrySeparator,
    menuEntryCopyPath,
    menuEntryCopyRelativePath,
  ]
  if (root) {
    entries.push(MenuEntrySeparator.menuEntrySeparator, menuEntryRemoveFolderFromWorkspace)
  }
  return entries
}