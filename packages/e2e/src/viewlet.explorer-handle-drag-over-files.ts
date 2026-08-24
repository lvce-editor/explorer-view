import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-handle-drag-over-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a/b.txt` },
    { content: '', uri: `${tmpDir}/a/c.txt` },
    { content: '', uri: `${tmpDir}/a/d.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Explorer.handleDragOverIndex(2)

  // assert
  const treeItems = Locator('.Explorer .TreeItem')
  const treeItemOne = treeItems.nth(0)
  await expect(treeItemOne).toHaveClass('DropTarget')
  const treeItemTwo = treeItems.nth(1)
  await expect(treeItemTwo).toHaveClass('DropTarget')
  const treeItemThree = treeItems.nth(2)
  await expect(treeItemThree).toHaveClass('DropTarget')
  const treeItemFour = treeItems.nth(3)
  await expect(treeItemFour).toHaveClass('DropTarget')
}
