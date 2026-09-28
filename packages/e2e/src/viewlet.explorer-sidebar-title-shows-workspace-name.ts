import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sidebar-title-shows-workspace-name'

export const test: Test = async ({ expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const workspacePath = `${tmpDir}/workspace-name`
  await FileSystem.mkdir(workspacePath)
  await Workspace.setPath(workspacePath)

  // act
  await SideBar.open('Explorer')

  // assert
  const title = Locator('.SideBarTitleAreaTitle')
  await expect(title).toHaveText('workspace-name')
}
