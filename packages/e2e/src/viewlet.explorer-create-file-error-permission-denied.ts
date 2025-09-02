import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-error-permission-denied'

export const test: Test = async ({ FileSystem, Workspace, Explorer, expect, Locator, Extension }) => {
  // arrange
  const uri = new URL('../fixtures/sample.file-system-provider-create-file-error-permission-denied', import.meta.url).toString()
  await Extension.addWebExtension(uri)
  const prefix = 'extension-host://xyz://'
  await FileSystem.writeFile(`${prefix}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${prefix}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${prefix}/file3.txt`, 'content 3')
  await Workspace.setPath(`${prefix}/`)

  // act
  await Explorer.newFile()

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.updateEditingValue('file4.txt')
  await Explorer.acceptEdit()

  // assert
  await expect(inputBox).toHaveClass('InputValidationError')
  const errorMessage = Locator('.ExplorerErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText('Error: Failed to execute file system provider: Permission Denied')
}
