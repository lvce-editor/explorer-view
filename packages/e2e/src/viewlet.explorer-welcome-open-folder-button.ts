import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-welcome-open-folder-button'

export const test: Test = async ({ expect, Explorer, Locator, Workspace }) => {
  // arrange
  await Workspace.setPath('')

  // assert
  const openFolderButton = Locator('button[name="OpenFolder"]')
  await expect(openFolderButton).toBeVisible()
  await expect(openFolderButton).toHaveText('Open folder')

  // act
  await Explorer.handleClickOpenFolder()
}
