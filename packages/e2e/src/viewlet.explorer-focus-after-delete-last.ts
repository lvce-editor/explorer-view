import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-after-delete-last'

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // focus the last item (file3, index 2)
  await Explorer.focusIndex(2)

  // act
  await Explorer.removeDirent()

  // assert - focus should move to the previous item (file2, now at index 1)
  const focusedFile = Locator('.TreeItem').nth(1)
  await expect(focusedFile).toHaveId('TreeItemActive')
}
