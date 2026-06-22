import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-delete-file-new-file'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: removeDirent deletes the focused file, newFile inserts an editing item — both fire concurrently
  await Promise.all([Command.execute('Explorer.removeDirent'), Command.execute('Explorer.newFile')])

  // assert: explorer should be stable — no crash, no stale rows
  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // If removeDirent won: file1 deleted, new editing item inserted → 3 items (2 files + 1 editing)
  // If newFile won: editing item inserted, then file1 deleted by removeDirent → 3 items
  // If both effects combine: could be 2-4
  expect(itemCount).toBeGreaterThanOrEqual(2)
  expect(itemCount).toBeLessThanOrEqual(4)

  // file1 should be gone (removeDirent should delete it regardless)
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeHidden()
}
