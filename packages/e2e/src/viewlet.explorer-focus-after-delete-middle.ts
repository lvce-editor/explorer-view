import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-after-delete-middle'

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)

  // focus file2 (middle item, index 1)
  await Explorer.focusIndex(1)

  // act
  await Explorer.removeDirent()

  // assert - focus should move to the next item (which was file3, now at index 1)
  const focusedFile = Locator('.TreeItem').nth(1)
  await expect(focusedFile).toHaveId('TreeItemActive')
}
