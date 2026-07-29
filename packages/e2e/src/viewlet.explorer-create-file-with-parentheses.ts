import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-with-parentheses'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.newFile()
  await Explorer.updateEditingValue('draft (final).txt')
  await Explorer.acceptEdit()

  const file = Locator('.TreeItem[aria-label="draft (final).txt"]')
  await expect(file).toBeVisible()
}
