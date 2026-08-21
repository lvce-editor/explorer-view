import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-delete-focused-folder-with-selection'

export const skip = ['webkit']

export const test: Test = async ({ ContextMenu, Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  let confirmMessage = ''
  await Dialog.mockConfirm((...args: readonly unknown[]) => {
    confirmMessage = String(args[0])
    return true
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder-1`)
  await FileSystem.mkdir(`${tmpDir}/folder-2`)
  await FileSystem.mkdir(`${tmpDir}/folder-3`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.toggleIndividualSelection(1)
  const folder1 = Locator('.TreeItem[aria-label="folder-1"]')
  const folder2 = Locator('.TreeItem[aria-label="folder-2"]')
  const folder3 = Locator('.TreeItem[aria-label="folder-3"]')
  await expect(folder1).toHaveClass('TreeItemActive')
  await expect(folder2).toHaveClass('TreeItemActive')

  // act
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('Delete')

  // assert
  if (confirmMessage !== 'Are you sure you want to delete "folder-1", "folder-2"?') {
    throw new Error(`unexpected confirm message: ${confirmMessage}`)
  }
  await expect(folder1).toBeHidden()
  await expect(folder2).toBeHidden()
  await expect(folder3).toBeVisible()
}
