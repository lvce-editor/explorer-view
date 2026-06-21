import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-remove-folder-from-workspace-action'

export const skip = 1

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.openContextMenu(-1)
  await ContextMenu.selectItem('Remove folder from workspace')

  // assert
  const file = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file).toBeHidden()
  const welcome = Locator('.Explorer .WelcomeMessage')
  await expect(welcome).toBeVisible()
}
