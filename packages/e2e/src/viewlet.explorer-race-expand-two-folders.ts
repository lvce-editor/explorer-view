import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-two-folders'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder-a`)
  await FileSystem.mkdir(`${tmpDir}/folder-b`)
  await FileSystem.writeFile(`${tmpDir}/folder-a/a1.txt`, 'a1')
  await FileSystem.writeFile(`${tmpDir}/folder-a/a2.txt`, 'a2')
  await FileSystem.writeFile(`${tmpDir}/folder-b/b1.txt`, 'b1')
  await FileSystem.writeFile(`${tmpDir}/folder-b/b2.txt`, 'b2')
  await Workspace.setPath(tmpDir)

  // act: click both folders concurrently to expand them — async expansions race
  await Promise.all([Command.execute('Explorer.handleClick', 0), Command.execute('Explorer.handleClick', 1)])

  // assert: explorer should be stable — no crash, no children from A under B or vice versa
  // Both folders should be visible
  const folderA = Locator('.TreeItem[aria-label="folder-a"]')
  const folderB = Locator('.TreeItem[aria-label="folder-b"]')
  await expect(folderA).toBeVisible()
  await expect(folderB).toBeVisible()

  // folder-a should be first
  const treeItems = Locator('.TreeItem')
  const firstItem = treeItems.nth(0)
  await expect(firstItem).toHaveText('folder-a')

  // At most 6 items (2 folders + 2 children each)
  await expect(treeItems.nth(6)).toBeHidden()
}
