import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sort-numeric-leading-zeroes'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/file10.txt` },
    { content: '', uri: `${tmpDir}/file001.txt` },
    { content: '', uri: `${tmpDir}/file01.txt` },
    { content: '', uri: `${tmpDir}/file1.txt` },
  ])

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(4)
  const firstTreeItem = treeItems.nth(0)
  const secondTreeItem = treeItems.nth(1)
  const thirdTreeItem = treeItems.nth(2)
  const fourthTreeItem = treeItems.nth(3)
  await expect(firstTreeItem).toHaveText('file001.txt')
  await expect(secondTreeItem).toHaveText('file01.txt')
  await expect(thirdTreeItem).toHaveText('file1.txt')
  await expect(fourthTreeItem).toHaveText('file10.txt')
}
