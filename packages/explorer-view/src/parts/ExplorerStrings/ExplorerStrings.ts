import * as I18nString from '../I18NString/I18NString.ts'

/**
 * @enum {string}
 */
const UiStrings = {
  NewFile: 'New File...',
  NewFolder: 'New Folder...',
  OpenContainingFolder: 'Open Containing Folder',
  OpenInIntegratedTerminal: 'Open in integrated Terminal',
  Cut: 'Cut',
  Copy: 'Copy',
  Paste: 'Paste',
  CopyPath: 'Copy Path',
  CopyRelativePath: 'Copy Relative Path',
  Rename: 'Rename',
  Delete: 'Delete',
  RefreshExplorer: 'Refresh Explorer',
  CollapseAllFoldersInExplorer: 'Collapse All Folders in Explorer',
  Explorer: 'Explorer',
  FilesExplorer: 'Files Explorer',
  YouHaveNotYetOpenedAFolder: 'You have not yet opened a folder',
  OpenFolder: 'Open folder',
  NoFolderOpen: 'No Folder Open',
}

export const newFile = (): string => {
  return I18nString.i18nString(UiStrings.NewFile)
}

export const newFolder = (): string => {
  return I18nString.i18nString(UiStrings.NewFolder)
}

export const openContainingFolder = (): string => {
  return I18nString.i18nString(UiStrings.OpenContainingFolder)
}

export const openInIntegratedTerminal = (): string => {
  return I18nString.i18nString(UiStrings.OpenInIntegratedTerminal)
}

export const cut = (): string => {
  return I18nString.i18nString(UiStrings.Cut)
}

export const copy = (): string => {
  return I18nString.i18nString(UiStrings.Copy)
}

export const paste = (): string => {
  return I18nString.i18nString(UiStrings.Paste)
}

export const copyPath = (): string => {
  return I18nString.i18nString(UiStrings.CopyPath)
}

export const copyRelativePath = (): string => {
  return I18nString.i18nString(UiStrings.CopyRelativePath)
}

export const rename = (): string => {
  return I18nString.i18nString(UiStrings.Rename)
}

export const deleteItem = (): string => {
  return I18nString.i18nString(UiStrings.Delete)
}

export const refresh = (): string => {
  return I18nString.i18nString(UiStrings.RefreshExplorer)
}

export const collapseAll = (): string => {
  return I18nString.i18nString(UiStrings.CollapseAllFoldersInExplorer)
}

export const explorer = (): string => {
  return I18nString.i18nString(UiStrings.Explorer)
}

export const filesExplorer = (): string => {
  return I18nString.i18nString(UiStrings.FilesExplorer)
}

export const youHaveNotYetOpenedAFolder = (): string => {
  return I18nString.i18nString(UiStrings.YouHaveNotYetOpenedAFolder)
}

export const openFolder = (): string => {
  return I18nString.i18nString(UiStrings.OpenFolder)
}

export const noFolderOpen = (): string => {
  return I18nString.i18nString(UiStrings.NoFolderOpen)
}
