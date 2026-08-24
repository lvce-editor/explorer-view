import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sort-case-dotfiles'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/A.txt` },
    { content: '', uri: `${tmpDir}/.env` },
    { content: '', uri: `${tmpDir}/_config.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
  ])
  await FileSystem.mkdir(`${tmpDir}/Folder`)
  await FileSystem.mkdir(`${tmpDir}/folder`)

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(7)
  const firstTreeItem = treeItems.nth(0)
  const secondTreeItem = treeItems.nth(1)
  const thirdTreeItem = treeItems.nth(2)
  const fourthTreeItem = treeItems.nth(3)
  const fifthTreeItem = treeItems.nth(4)
  const sixthTreeItem = treeItems.nth(5)
  const seventhTreeItem = treeItems.nth(6)
  await expect(firstTreeItem).toHaveText('Folder')
  await expect(secondTreeItem).toHaveText('folder')
  await expect(thirdTreeItem).toHaveText('_config.txt')
  await expect(fourthTreeItem).toHaveText('.env')
  await expect(fifthTreeItem).toHaveText('A.txt')
  await expect(sixthTreeItem).toHaveText('a.txt')
  await expect(seventhTreeItem).toHaveText('b.txt')
}
