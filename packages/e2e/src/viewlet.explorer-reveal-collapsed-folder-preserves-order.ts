import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-collapsed-folder-preserves-order'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const nestedFilePath = `${tmpDir}/a/b/c.txt`
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await FileSystem.writeFile(nestedFilePath, 'content')
  await FileSystem.writeFile(`${tmpDir}/z.txt`, 'content')
  await Workspace.setPath(tmpDir)
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
  const folderA = treeItems.nth(0)
  const folderB = treeItems.nth(1)
  const nestedFile = treeItems.nth(2)
  const rootFile = treeItems.nth(3)

  // act
  await Command.execute('Explorer.reveal', nestedFilePath)

  // assert
  await expect(treeItems).toHaveCount(4)
  await expect(folderA).toHaveText('a')
  await expect(folderB).toHaveText('b')
  await expect(nestedFile).toHaveText('c.txt')
  await expect(nestedFile).toHaveId('TreeItemActive')
  await expect(rootFile).toHaveText('z.txt')
}
