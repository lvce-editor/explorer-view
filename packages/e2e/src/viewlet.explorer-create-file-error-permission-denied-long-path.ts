import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-error-permission-denied'

export const skip = 1

export const test: Test = async ({ expect, Explorer, Extension, FileSystem, Locator, Workspace }) => {
  // arrange
  const uri = import.meta.resolve('../fixtures/sample.file-system-provider-create-file-error-permission-denied-long-path')
  await Extension.addWebExtension(uri)
  const prefix = 'extension-host://xyz://'
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${prefix}/usr/lib/lvce/resources/app/playground/file1.txt` },
    { content: 'content 2', uri: `${prefix}/usr/lib/lvce/resources/app/playground/file2.txt` },
    { content: 'content 3', uri: `${prefix}/usr/lib/lvce/resources/app/playground/file3.txt` },
  ])
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
  await expect(errorMessage).toHaveText(
    `Error: Failed to execute file system provider: Error: Failed to write to file "/file4.txt": EACCES: permission denied, open '/file4.txt'`,
  )
}
