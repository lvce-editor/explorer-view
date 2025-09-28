import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-handle-drag-over-folder'

export const test: Test = async ({ Explorer, FileSystem, Workspace, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/a/c.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/a/d.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Explorer.handleDragOver(5000, 100)

  // assert
  const treeItems = Locator('.Explorer .TreeItem')
  const treeItemOne = treeItems.nth(0)
  await expect(treeItemOne).toHaveClass('DropTarget')
  const treeItemTwo = treeItems.nth(1)
  await expect(treeItemTwo).toHaveClass('DropTarget')
  const treeItemThree = treeItems.nth(2)
  await expect(treeItemThree).toHaveClass('DropTarget')
  // TODO
  // const treeItemFour = treeItems.nth(3)
  // await expect(treeItemFour).toHaveClass('DropTarget')
}
