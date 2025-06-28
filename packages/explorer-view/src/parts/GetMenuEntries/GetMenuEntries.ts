import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.ts'

const menuEntryNewFile: MenuEntry = {
  id: 'newFile',
  label: ViewletExplorerStrings.newFile(),
  flags: MenuItemFlags.None,
  command: 'Explorer.newFile',
}

const menuEntryNewFolder: MenuEntry = {
  id: 'newFolder',
  label: ViewletExplorerStrings.newFolder(),
  flags: MenuItemFlags.None,
  command: 'Explorer.newFolder',
}

const menuEntryOpenContainingFolder: MenuEntry = {
  id: 'openContainingFolder',
  label: ViewletExplorerStrings.openContainingFolder(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.openContainingFolder',
}

const menuEntryOpenInIntegratedTerminal: MenuEntry = {
  id: 'openInIntegratedTerminal',
  label: ViewletExplorerStrings.openInIntegratedTerminal(),
  flags: MenuItemFlags.None,
  command: /* TODO */ '-1',
}

const menuEntryCut: MenuEntry = {
  id: 'cut',
  label: ViewletExplorerStrings.cut(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.handleCut',
}

const menuEntryCopy: MenuEntry = {
  id: 'copy',
  label: ViewletExplorerStrings.copy(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.handleCopy',
}

const menuEntryPaste: MenuEntry = {
  id: 'paste',
  label: ViewletExplorerStrings.paste(),
  flags: MenuItemFlags.None,
  command: 'Explorer.handlePaste',
}

const menuEntryCopyPath: MenuEntry = {
  id: 'copyPath',
  label: ViewletExplorerStrings.copyPath(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.copyPath',
}

const menuEntryCopyRelativePath: MenuEntry = {
  id: 'copyRelativePath',
  label: ViewletExplorerStrings.copyRelativePath(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.copyRelativePath',
}

const menuEntryRename: MenuEntry = {
  id: 'rename',
  label: ViewletExplorerStrings.rename(),
  flags: MenuItemFlags.None,
  command: 'Explorer.renameDirent',
}

const menuEntryDelete: MenuEntry = {
  id: 'delete',
  label: ViewletExplorerStrings.deleteItem(),
  flags: MenuItemFlags.None,
  command: 'Explorer.removeDirent',
}

const ALL_ENTRIES: readonly MenuEntry[] = [
  menuEntryNewFile,
  menuEntryNewFolder,
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
  menuEntryRename,
  menuEntryDelete,
]

// TODO there are two possible ways of getting the focused dirent of explorer
// 1. directly access state of explorer (bad because it directly accesses state of another component)
// 2. expose getFocusedDirent method in explorer (bad because explorer code should not know about for menuEntriesExplorer, which needs that method)
const getFocusedDirent = (explorerState: ExplorerState): ExplorerItem | undefined => {
  if (!explorerState || explorerState.focusedIndex < 0) {
    return undefined
  }
  return explorerState.items[explorerState.focusedIndex]
}

const getMenuEntriesDirectory = (): readonly MenuEntry[] => {
  return ALL_ENTRIES
}

const getMenuEntriesFile = (): readonly MenuEntry[] => {
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
    menuEntryRename,
    menuEntryDelete,
  ]
}

const getMenuEntriesDefault = (): readonly MenuEntry[] => {
  return ALL_ENTRIES
}

const getMenuEntriesRoot = (): readonly MenuEntry[] => {
  return [
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
}

export const getMenuEntries = (state: ExplorerState): readonly MenuEntry[] => {
  const focusedDirent = getFocusedDirent(state)
  if (!focusedDirent) {
    return getMenuEntriesRoot()
  }
  switch (focusedDirent.type) {
    case DirentType.Directory:
      return getMenuEntriesDirectory()
    case DirentType.File:
      return getMenuEntriesFile()
    default:
      return getMenuEntriesDefault()
  }
}
