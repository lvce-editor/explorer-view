import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-collapse-all-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, 'child')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.expandRecursively')

  // act: collapseAll removes expanded children while refresh concurrently rebuilds the tree
  await Promise.all([Command.execute('Explorer.collapseAll'), Command.execute('Explorer.refresh')])

  // assert: top-level items remain stable and no child is duplicated
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
