import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-expand-all-empty-folders'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  await Explorer.expandAll()

  const firstFolder = Locator('.TreeItem[aria-label="a"]')
  const secondFolder = Locator('.TreeItem[aria-label="b"]')
  const treeItems = Locator('.TreeItem')
  await expect(firstFolder).toHaveAttribute('aria-expanded', 'true')
  await expect(secondFolder).toHaveAttribute('aria-expanded', 'true')
  await expect(treeItems).toHaveCount(2)
}
