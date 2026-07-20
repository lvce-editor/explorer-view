import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-all-refresh'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/a.txt`, 'a')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await FileSystem.writeFile(`${tmpDir}/b/b.txt`, 'b')
  await Workspace.setPath(tmpDir)

  // act: expandAll reads both folders while refresh concurrently replaces their rows
  await Promise.all([Command.execute('Explorer.expandAll'), Command.execute('Explorer.refresh')])

  // assert: root folders remain visible and neither child is duplicated
  const a = Locator('.TreeItem[aria-label="a"]')
  const b = Locator('.TreeItem[aria-label="b"]')
  const aChildren = Locator('.TreeItem[aria-label="a.txt"]')
  const bChildren = Locator('.TreeItem[aria-label="b.txt"]')
  const duplicateAChild = aChildren.nth(1)
  const duplicateBChild = bChildren.nth(1)
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()
  await expect(duplicateAChild).toBeHidden()
  await expect(duplicateBChild).toBeHidden()

  const treeItems = Locator('.TreeItem')
  const extraTreeItem = treeItems.nth(4)
  await expect(extraTreeItem).toBeHidden()
}
