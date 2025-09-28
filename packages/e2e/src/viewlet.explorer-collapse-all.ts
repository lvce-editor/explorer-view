import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-collapse-all'

export const test: Test = async ({ FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await FileSystem.mkdir(`${tmpDir}/a/b/c`)
  await FileSystem.mkdir(`${tmpDir}/a/b/c/d`)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusLast()

  // act
  await Explorer.collapseAll()

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(1)
  await expect(treeItems.nth(0)).toHaveText('a')
}
