import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-validation-blur'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()
  await Explorer.renameDirent()

  // act
  await Explorer.updateEditingValue('')
  await Explorer.acceptEdit()
  await Explorer.handleInputBlur()

  // assert
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  const input = Locator('input')
  await expect(file).toBeVisible()
  await expect(input).toBeHidden()
}
