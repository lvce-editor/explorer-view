import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-error-permission-denied'

export const skip = 1

export const test: Test = async ({ FileSystem, Workspace, Explorer, expect, Locator, Extension }) => {
  // arrange
  const uri = new URL('../fixtures/sample.file-system-provider-permission', import.meta.url).toString()
  await Extension.addWebExtension(uri)

  const prefix = 'extension-host://xyz://'
  await FileSystem.writeFile(`${prefix}/file1.txt`, 'content 1')
  await Workspace.setPath(`${prefix}/`)
  await Explorer.focusIndex(0)

  // act
  await Explorer.rename()
  await Explorer.updateEditingValue('file4.txt')
  await Explorer.acceptEdit()

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()
  await expect(inputBox).toHaveClass('InputValidationError')
  const errorMessage = Locator('.ExplorerErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText('Error: Failed to execute file system provider: Permission Denied')
}
