import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-last-empty-workspace-no-op'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.focusLast()

  const treeItems = Locator('.TreeItem')
  const activeItems = Locator('#TreeItemActive')
  await expect(treeItems).toHaveCount(0)
  await expect(activeItems).toHaveCount(0)
}
