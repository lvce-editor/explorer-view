import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-close-workspace-resets-sidebar-title'

export const test: Test = async ({ expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.close()
  await Workspace.setPath(tmpDir)
  await SideBar.open('Search')
  await SideBar.open('Explorer')
  const title = Locator('.SideBarTitleAreaTitle')
  const workspaceName = tmpDir.slice(tmpDir.lastIndexOf('/') + 1)
  await expect(title).toHaveText(workspaceName)

  // act
  await Workspace.close()

  // assert
  await expect(title).toHaveText('Explorer')
}
