import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-select-up-refresh'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 2)

  // act: selectUp extends selection while refresh concurrently replaces the selected rows
  await Promise.all([Command.execute('Explorer.selectUp'), Command.execute('Explorer.refresh')])

  // assert: all files remain visible exactly once
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file1).toBeVisible()
  await expect(file2).toBeVisible()
  await expect(file3).toBeVisible()

  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(3)
}
