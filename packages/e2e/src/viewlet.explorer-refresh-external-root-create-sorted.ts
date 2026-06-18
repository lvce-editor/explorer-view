import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-root-create-sorted'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)

  // act
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await Explorer.refresh()

  // assert
  const treeItems = Locator('.TreeItem')
  const firstTreeItem = treeItems.nth(0)
  const secondTreeItem = treeItems.nth(1)
  const thirdTreeItem = treeItems.nth(2)
  await expect(treeItems).toHaveCount(3)
  await expect(firstTreeItem).toHaveText('a.txt')
  await expect(secondTreeItem).toHaveText('b.txt')
  await expect(thirdTreeItem).toHaveText('c.txt')
}
