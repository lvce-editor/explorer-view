import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-with-equals-sign'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.newFile()
  await Explorer.updateEditingValue('key=value.txt')
  await Explorer.acceptEdit()

  const file = Locator('.TreeItem[aria-label="key=value.txt"]')
  await expect(file).toBeVisible()
  await expect(file).toHaveId('TreeItemActive')
}
