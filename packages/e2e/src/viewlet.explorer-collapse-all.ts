import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-collapse-all'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await FileSystem.mkdir(`${tmpDir}/a/b/c`)
  await FileSystem.mkdir(`${tmpDir}/a/b/c/d`)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusLast()

  // act
  await Command.execute(`Explorer.collapseAll`)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems.nth(0)).toHaveText('a')
  await expect(treeItems.nth(1)).toHaveText('b')
  await expect(treeItems.nth(2)).toHaveText('c.txt')
}
