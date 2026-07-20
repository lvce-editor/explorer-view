import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-collapse-all-multiple-roots'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.mkdir(`${tmpDir}/b`)
  await FileSystem.writeFile(`${tmpDir}/a/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b/b.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandAll()
  await Explorer.focusLast()

  await Explorer.collapseAll()

  const firstFolder = Locator('.TreeItem[aria-label="a"]')
  const secondFolder = Locator('.TreeItem[aria-label="b"]')
  const treeItems = Locator('.TreeItem')
  await expect(firstFolder).toHaveAttribute('aria-expanded', 'false')
  await expect(firstFolder).toHaveId('TreeItemActive')
  await expect(secondFolder).toHaveAttribute('aria-expanded', 'false')
  await expect(treeItems).toHaveCount(2)
}
