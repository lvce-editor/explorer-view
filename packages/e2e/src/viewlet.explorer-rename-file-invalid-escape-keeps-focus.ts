import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-invalid-escape-keeps-focus'

export const skip = 1

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
  await Explorer.handleEscape()

  // assert
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  const input = Locator('input')
  await expect(input).toBeHidden()
  await expect(file).toBeVisible()
  await expect(file).toHaveId('TreeItemActive')
}
