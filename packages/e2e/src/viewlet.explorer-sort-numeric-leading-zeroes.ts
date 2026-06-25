import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sort-numeric-leading-zeroes'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file10.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file001.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file01.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(4)
  await expect(treeItems.nth(0)).toHaveText('file001.txt')
  await expect(treeItems.nth(1)).toHaveText('file01.txt')
  await expect(treeItems.nth(2)).toHaveText('file1.txt')
  await expect(treeItems.nth(3)).toHaveText('file10.txt')
}
