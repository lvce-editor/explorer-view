import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sort-case-dotfiles'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/A.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/.env`, '')
  await FileSystem.writeFile(`${tmpDir}/_config.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.mkdir(`${tmpDir}/Folder`)
  await FileSystem.mkdir(`${tmpDir}/folder`)

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(7)
  await expect(treeItems.nth(0)).toHaveText('Folder')
  await expect(treeItems.nth(1)).toHaveText('folder')
  await expect(treeItems.nth(2)).toHaveText('_config.txt')
  await expect(treeItems.nth(3)).toHaveText('.env')
  await expect(treeItems.nth(4)).toHaveText('A.txt')
  await expect(treeItems.nth(5)).toHaveText('a.txt')
  await expect(treeItems.nth(6)).toHaveText('b.txt')
}
