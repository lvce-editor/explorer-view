import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-rename-file'

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.openContextMenu(1)
  await ContextMenu.selectItem('Rename')

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.updateEditingValue('renamed.txt')
  await Explorer.acceptEdit()

  // assert
  const renamedFile = Locator('.TreeItem[aria-label="renamed.txt"]')
  await expect(renamedFile).toBeVisible()
}
