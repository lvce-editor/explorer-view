import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-delete-unselected-with-selection'

export const test: Test = async ({ ContextMenu, Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Explorer.selectIndices([0, 1])
  const selectedFile1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const selectedFile2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const contextTarget = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(selectedFile1).toHaveClass('TreeItemActive')
  await expect(selectedFile2).toHaveClass('TreeItemActive')

  // act
  await Explorer.openContextMenu(2)
  await ContextMenu.selectItem('Delete')

  // assert
  await expect(selectedFile1).toBeVisible()
  await expect(selectedFile2).toBeVisible()
  await expect(contextTarget).toBeHidden()
}
