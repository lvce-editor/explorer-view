import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sidebar-title-shows-remote-ssh-host'

export const test: Test = async ({ expect, FileSystem, Locator, SideBar, Workspace }) => {
  // arrange
  await Workspace.setPath('remote-ssh://user@example.com:2222/home/test/workspace-name')
  await SideBar.open('Explorer')
  const title = Locator('.SideBarTitleAreaTitle')

  // assert
  await expect(title).toHaveText('workspace-name [SSH: example.com]')

  // act
  await Workspace.setPath('remote-ssh://another-user@another.example:2200/home/test/other-workspace')

  // assert
  await expect(title).toHaveText('other-workspace [SSH: another.example]')

  // act
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // assert
  await expect(title).toHaveText(tmpDir.slice(tmpDir.lastIndexOf('/') + 1))
}
