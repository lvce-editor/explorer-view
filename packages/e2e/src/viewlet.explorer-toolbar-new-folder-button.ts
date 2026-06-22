import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-new-folder-button'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act
  const newFolderButton = Locator('button[name="NewFolder"]')
  await newFolderButton.click()

  // assert
  const inputBox = Locator('.Explorer input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()
}
