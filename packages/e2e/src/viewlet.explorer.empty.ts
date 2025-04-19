import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'explorer.empty'

export const test: Test = async ({ FileSystem, Workspace, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await SideBar.open('Explorer')

  // assert
  const explorer = Locator('.Explorer')
  await expect(explorer).toBeVisible()
}
