import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-delete-file-new-file'

export const skip = ['webkit']

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: removeDirent deletes the focused file, newFile inserts an editing item — both fire concurrently
  await Promise.all([Explorer.removeDirent(), Explorer.newFile()])

  // assert: explorer should be stable — no crash, no stale rows
  // file2.txt and file3.txt should always be visible
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file2).toBeVisible()
  await expect(file3).toBeVisible()

  // At most 4 tree items (3 files - 1 deleted + 1 editing row = could be 2-4)
  const treeItems = Locator('.TreeItem')
  const fifthItem = treeItems.nth(4)
  await expect(fifthItem).toBeHidden()
}
