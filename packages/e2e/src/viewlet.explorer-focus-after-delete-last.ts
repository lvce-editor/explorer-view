import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-after-delete-last'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)

  // focus the last item (file3, index 2)
  await Explorer.focusIndex(2)

  // act
  await Explorer.removeDirent()

  // assert - focus should move to the previous item (file2, now at index 1)
  const focusedFile = Locator('.TreeItem').nth(1)
  await expect(focusedFile).toHaveId('TreeItemActive')
}
