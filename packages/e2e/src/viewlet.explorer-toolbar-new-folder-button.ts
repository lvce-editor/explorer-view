import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-new-folder-button'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFolder()

  // assert
  const firstTreeItem = Locator('.TreeItem').nth(0)
  const inputBox = firstTreeItem.locator('input')
  const folderIcon = firstTreeItem.locator('.FileIcon')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()
  await expect(folderIcon).toBeVisible()

  // act
  await Explorer.updateEditingValue('my-folder')
  await Explorer.acceptEdit()

  // assert
  const newFolder = Locator('.Explorer').locator('text=my-folder')
  await expect(newFolder).toBeVisible()
}
