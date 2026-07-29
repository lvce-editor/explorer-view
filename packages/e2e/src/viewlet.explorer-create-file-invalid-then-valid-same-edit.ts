import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-invalid-then-valid-same-edit'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Explorer.newFile()

  // act
  await Explorer.updateEditingValue('/invalid.txt')
  await Explorer.acceptEdit()

  // assert
  const input = Locator('input')
  await expect(input).toHaveClass('InputValidationError')

  // act
  await Explorer.updateEditingValue('valid.txt')
  await Explorer.acceptEdit()

  // assert
  const file = Locator('.TreeItem[aria-label="valid.txt"]')
  await expect(file).toBeVisible()
  await expect(input).toBeHidden()
}
