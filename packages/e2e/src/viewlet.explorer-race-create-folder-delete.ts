import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-create-folder-delete'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)
  await Explorer.newFolder()
  await Explorer.updateEditingValue('new-folder')
  await Explorer.focusIndex(0)

  // act: acceptEdit creates the folder, removeDirent deletes file1.txt — both fire concurrently
  await Promise.all([Explorer.acceptEdit(), Explorer.removeDirent()])

  // assert: explorer should be stable — no crash
  // file2.txt should always be visible
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  await expect(file2).toBeVisible()

  // At most 3 tree items (file2.txt + possibly new-folder + possibly file1.txt)
  const treeItems = Locator('.TreeItem')
  const row3 = treeItems.nth(3)
  await expect(row3).toBeHidden()
}
