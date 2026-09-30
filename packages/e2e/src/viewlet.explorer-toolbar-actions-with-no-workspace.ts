import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-actions-with-no-workspace'

export const test: Test = async ({ expect, Explorer, Locator, Workspace }) => {
  // arrange
  await Workspace.setPath('')

  // act
  await Explorer.refresh()
  await Explorer.collapseAll()

  // assert
  const welcome = Locator('.Explorer .Welcome')
  const openFolderButton = Locator('button[name="OpenFolder"]')
  await expect(welcome).toBeVisible()
  await expect(openFolderButton).toBeVisible()
}
