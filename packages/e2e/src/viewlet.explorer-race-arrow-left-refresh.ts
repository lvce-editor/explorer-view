import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-arrow-left-refresh'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, 'child')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Explorer.handleClick(0)
  await Explorer.focusIndex(1)

  // act: handleArrowLeft moves focus to the parent while refresh concurrently rebuilds the tree
  await Promise.all([Explorer.handleArrowLeft(), Explorer.refresh()])

  // assert: the tree has no stale or duplicate rows
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  const children = Locator('.TreeItem[aria-label="child.txt"]')
  const duplicateChild = children.nth(1)
  await expect(folder).toBeVisible()
  await expect(rootFile).toBeVisible()
  await expect(duplicateChild).toBeHidden()

  const treeItems = Locator('.TreeItem')
  const extraTreeItem = treeItems.nth(3)
  await expect(extraTreeItem).toBeHidden()
}
