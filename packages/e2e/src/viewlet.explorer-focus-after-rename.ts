import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-after-rename'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)

  await Explorer.focusIndex(1)

  // act
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('renamed-file.txt')
  await Explorer.acceptEdit()

  // assert - the renamed file should be visible and focused
  const renamedFile = Locator('.TreeItem[aria-label="renamed-file.txt"]')
  await expect(renamedFile).toBeVisible()
  await expect(renamedFile).toHaveId('TreeItemActive')
}
