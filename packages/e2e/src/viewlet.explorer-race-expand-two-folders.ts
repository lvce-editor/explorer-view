import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-two-folders'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder-a`)
  await FileSystem.mkdir(`${tmpDir}/folder-b`)
  await FileSystem.setFiles([
    { content: 'a1', uri: `${tmpDir}/folder-a/a1.txt` },
    { content: 'a2', uri: `${tmpDir}/folder-a/a2.txt` },
    { content: 'b1', uri: `${tmpDir}/folder-b/b1.txt` },
    { content: 'b2', uri: `${tmpDir}/folder-b/b2.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act: click both folders concurrently to expand them — async expansions race
  await Promise.all([Explorer.handleClick(0), Explorer.handleClick(1)])

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
  const seventhItem = treeItems.nth(6)
  await expect(seventhItem).toBeHidden()
}
