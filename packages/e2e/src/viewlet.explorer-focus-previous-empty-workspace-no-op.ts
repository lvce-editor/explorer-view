import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-previous-empty-workspace-no-op'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Command.execute('Explorer.focusPrevious')

  const treeItems = Locator('.TreeItem')
  const listItems = Locator('.ListItems')
  await expect(treeItems).toHaveCount(0)
  await expect(listItems).not.toHaveAttribute('aria-activedescendant', 'TreeItemActive')
}
