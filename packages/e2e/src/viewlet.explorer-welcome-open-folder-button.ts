import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-welcome-open-folder-button'

export const test: Test = async ({ expect, Locator, Workspace }) => {
  // arrange
  await Workspace.setPath('')

  // act
  const openFolderButton = Locator('button[name="OpenFolder"]')
  await expect(openFolderButton).toBeVisible()
  await expect(openFolderButton).toHaveText('Open folder')

  // assert - button is clickable (in test environment, the dialog may not open,
  // but clicking should not throw)
  await openFolderButton.click()
}
