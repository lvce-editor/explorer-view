import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-provider-error-keeps-original-focus'

export const skip = 1

export const test: Test = async ({ expect, Explorer, Extension, FileSystem, Locator, Workspace }) => {
  // arrange
  const uri = import.meta.resolve('../fixtures/sample.file-system-provider-permission')
  await Extension.addWebExtension(uri)
  const prefix = 'sample-file-system-provider-permission://xyz'
  await FileSystem.writeFile(`${prefix}/file1.txt`, '')
  await Workspace.setPath(`${prefix}/`)
  await Explorer.focusFirst()

  // act
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('file2.txt')
  await Explorer.acceptEdit()

  // assert
  const original = Locator('.TreeItem[aria-label="file1.txt"]')
  const renamed = Locator('.TreeItem[aria-label="file2.txt"]')
  const input = Locator('input')
  await expect(original).toBeVisible()
  await expect(original).toHaveId('TreeItemActive')
  await expect(renamed).toBeHidden()
  await expect(input).toHaveClass('InputValidationError')
}
