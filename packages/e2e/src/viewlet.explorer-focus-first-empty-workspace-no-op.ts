import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-first-empty-workspace-no-op'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusFirst()

  // assert
  const items = Locator('.TreeItem')
  const activeItem = Locator('#TreeItemActive')
  await expect(items).toHaveCount(0)
  await expect(activeItem).toBeHidden()
}
