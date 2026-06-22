import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-collapse-all-button'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder/nested`)
  await FileSystem.writeFile(`${tmpDir}/folder/nested/file.txt`, 'content')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'content')
  await Workspace.setPath(tmpDir)

  // expand folder
  await Explorer.expandRecursively()

  // act
  await Explorer.collapseAll()

  // assert - only root items remain after collapsing
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
}
