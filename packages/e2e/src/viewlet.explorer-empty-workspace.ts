import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-empty-workspace'

export const test: Test = async ({ Workspace, Locator, expect }) => {
  // act
  await Workspace.setPath('')

  // assert
  const welcome = Locator('.Explorer .Welcome')
  await expect(welcome).toBeVisible()
  const welcomeMessage = Locator('.Explorer .WelcomeMessage')
  await expect(welcomeMessage).toBeVisible()
  await expect(welcomeMessage).toHaveText('You have not yet opened a folder')
  const openFolderButton = Locator('.Explorer .Button')
  await expect(openFolderButton).toBeVisible()
  await expect(openFolderButton).toHaveText('Open folder')
}
