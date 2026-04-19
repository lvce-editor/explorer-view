import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as MenuEntrySeparator from '../MenuEntrySeparator/MenuEntrySeparator.ts'
import * as MenuItemFlags from '../MenuItemFlags/MenuItemFlags.ts'

export const menuEntryNewFile: MenuEntry = {
  command: 'Explorer.newFile',
  flags: MenuItemFlags.None,
  id: 'newFile',
  label: ViewletExplorerStrings.newFile(),
}

export const menuEntryNewFolder: MenuEntry = {
  command: 'Explorer.newFolder',
  flags: MenuItemFlags.None,
  id: 'newFolder',
  label: ViewletExplorerStrings.newFolder(),
}

export const menuEntryOpenContainingFolder: MenuEntry = {
  command: 'Explorer.openContainingFolder',
  flags: MenuItemFlags.RestoreFocus,
  id: 'openContainingFolder',
  label: ViewletExplorerStrings.openContainingFolder(),
}

export const menuEntryOpenInIntegratedTerminal: MenuEntry = {
  command: /* TODO */ '-1',
  flags: MenuItemFlags.None,
  id: 'openInIntegratedTerminal',
  label: ViewletExplorerStrings.openInIntegratedTerminal(),
}

export const menuEntryCut: MenuEntry = {
  command: 'Explorer.handleCut',
  flags: MenuItemFlags.RestoreFocus,
  id: 'cut',
  label: ViewletExplorerStrings.cut(),
}

export const menuEntryCopy: MenuEntry = {
  command: 'Explorer.handleCopy',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copy',
  label: ViewletExplorerStrings.copy(),
}

export const menuEntryPaste: MenuEntry = {
  command: 'Explorer.handlePaste',
  flags: MenuItemFlags.None,
  id: 'paste',
  label: ViewletExplorerStrings.paste(),
}

export const menuEntryCopyPath: MenuEntry = {
  command: 'Explorer.copyPath',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copyPath',
  label: ViewletExplorerStrings.copyPath(),
}

export const menuEntryCopyRelativePath: MenuEntry = {
  command: 'Explorer.copyRelativePath',
  flags: MenuItemFlags.RestoreFocus,
  id: 'copyRelativePath',
  label: ViewletExplorerStrings.copyRelativePath(),
}

export const menuEntrySelectForCompare: MenuEntry = {
  command: 'Explorer.selectForCompare',
  flags: MenuItemFlags.RestoreFocus,
  id: 'selectForCompare',
  label: ViewletExplorerStrings.selectForCompare(),
}

export const menuEntryCompareWithSelected: MenuEntry = {
  command: 'Explorer.compareWithSelected',
  flags: MenuItemFlags.RestoreFocus,
  id: 'compareWithSelected',
  label: ViewletExplorerStrings.compareWithSelected(),
}

export const menuEntryRename: MenuEntry = {
  command: 'Explorer.renameDirent',
  flags: MenuItemFlags.None,
  id: 'rename',
  label: ViewletExplorerStrings.rename(),
}

export const menuEntryDelete: MenuEntry = {
  command: 'Explorer.removeDirent',
  flags: MenuItemFlags.None,
  id: 'delete',
  label: ViewletExplorerStrings.deleteItem(),
}

export const menuEntryRemoveFolderFromWorkspace: MenuEntry = {
  command: 'Workspace.close',
  flags: MenuItemFlags.None,
  id: 'removeFolderFromWorkspace',
  label: ViewletExplorerStrings.removeFolderFromWorkspace(),
}

export const allEntries: readonly MenuEntry[] = [
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