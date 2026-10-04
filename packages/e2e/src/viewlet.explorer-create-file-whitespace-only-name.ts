import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-whitespace-only-name'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const whitespaceOnly = ' '.repeat(3)

  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setUri(tmpDir)
  await Explorer.newFile()

  // act
  const input = Locator('input')
  await expect(input).toBeFocused()
  await input.type(whitespaceOnly)

  // assert
  await expect(input).toHaveValue(whitespaceOnly)
  const errorMessage = Locator('.ExplorerErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText('A file or folder name must be provided.')
  await expect(input).toHaveClass('InputValidationError')

  // act
  await Explorer.acceptEdit()

  // assert
  await expect(input).toBeVisible()
  const whitespaceFile = Locator(`.TreeItem[aria-label="${whitespaceOnly}"]`)
  await expect(whitespaceFile).toBeHidden()

  // act
  await Explorer.updateEditingValue('valid.txt')

  // assert
  await expect(input).toHaveAttribute('class', 'ExplorerInputBox')
  await expect(errorMessage).toBeHidden()

  // act
  await Explorer.acceptEdit()

  // assert
  const validFile = Locator('.TreeItem[aria-label="valid.txt"]')
  await expect(validFile).toBeVisible()
  await expect(input).toBeHidden()
}
