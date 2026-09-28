import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-load-error-displays-code'

export const test: Test = async ({ expect, FileSystem, Layout, Locator, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await Workspace.setPath(`${tmpDir}/missing-folder`)
  await SideBar.hide()
  await Layout.showSideBar()

  const error = Locator('.Explorer .WelcomeMessage')
  await expect(error).toBeVisible()
  await expect(error).toContainText('Could not open')
  await expect(error).toContainText('Error code: ')
}
