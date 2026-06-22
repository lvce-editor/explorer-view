import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-new-file-button'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act
  const newFileButton = Locator('button[name="NewFile"]')
  await newFileButton.click()

  // assert
  const inputBox = Locator('.Explorer input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()
}
