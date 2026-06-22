import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-new-file'

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.openContextMenu(-1)
  await ContextMenu.selectItem('New File...')

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()
}
