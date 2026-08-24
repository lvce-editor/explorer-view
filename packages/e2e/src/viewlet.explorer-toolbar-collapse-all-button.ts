import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-collapse-all-button'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder/nested`)
  await FileSystem.setFiles([
    { content: 'content', uri: `${tmpDir}/folder/nested/file.txt` },
    { content: 'content', uri: `${tmpDir}/root.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // expand folder
  await Explorer.expandRecursively()

  // act
  await Explorer.collapseAll()

  // assert - only root items remain after collapsing
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
}
