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
  await expect(treeItems).toHaveCount(3)
  await expect(treeItems.nth(0)).toHaveText('a.txt')
  await expect(treeItems.nth(1)).toHaveText('b.txt')
  await expect(treeItems.nth(2)).toHaveText('c.txt')
}
