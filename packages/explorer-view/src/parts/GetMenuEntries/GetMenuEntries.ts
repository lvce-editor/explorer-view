import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.ts'

const menuEntryNewFile = {
  id: 'newFile',
  label: ViewletExplorerStrings.newFile(),
  flags: MenuItemFlags.None,
  command: 'Explorer.newFile',
}

const menuEntryNewFolder = {
  id: 'newFolder',
  label: ViewletExplorerStrings.newFolder(),
  flags: MenuItemFlags.None,
  command: 'Explorer.newFolder',
}

const menuEntryOpenContainingFolder = {
  id: 'openContainingFolder',
  label: ViewletExplorerStrings.openContainingFolder(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.openContainingFolder',
}

const menuEntryOpenInIntegratedTerminal = {
  id: 'openInIntegratedTerminal',
  label: ViewletExplorerStrings.openInIntegratedTerminal(),
  flags: MenuItemFlags.None,
  command: /* TODO */ -1,
}

const menuEntryCut = {
  id: 'cut',
  label: ViewletExplorerStrings.cut(),
  flags: MenuItemFlags.RestoreFocus,
  command: /* TODO */ -1,
}

const menuEntryCopy = {
  id: 'copy',
  label: ViewletExplorerStrings.copy(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.handleCopy',
}

const menuEntryPaste = {
  id: 'paste',
  label: ViewletExplorerStrings.paste(),
  flags: MenuItemFlags.None,
  command: 'Explorer.handlePaste',
}

const menuEntryCopyPath = {
  id: 'copyPath',
  label: ViewletExplorerStrings.copyPath(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.copyPath',
}

const menuEntryCopyRelativePath = {
  id: 'copyRelativePath',
  label: ViewletExplorerStrings.copyRelativePath(),
  flags: MenuItemFlags.RestoreFocus,
  command: 'Explorer.copyRelativePath',
}

const menuEntryRename = {
  id: 'rename',
  label: ViewletExplorerStrings.rename(),
  flags: MenuItemFlags.None,
  command: 'Explorer.renameDirent',
}

const menuEntryDelete = {
  id: 'delete',
  label: ViewletExplorerStrings.deleteItem(),
  flags: MenuItemFlags.None,
  command: 'Explorer.removeDirent',
}

const ALL_ENTRIES = [
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
const getFocusedDirent = (explorerState: ExplorerState): any => {
  if (!explorerState || explorerState.focusedIndex < 0) {
    return undefined
  }
  return explorerState.items[explorerState.focusedIndex]
}

const getMenuEntriesDirectory = (): any => {
  return ALL_ENTRIES
}

const getMenuEntriesFile = (): any => {
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

const getMenuEntriesDefault = (): any => {
  return ALL_ENTRIES
}

const getMenuEntriesRoot = (): any => {
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

export const getMenuEntries = (state: ExplorerState): any => {
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
