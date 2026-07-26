import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-with-multiple-dots'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.newFile()
  await Explorer.updateEditingValue('archive..txt')
  await Explorer.acceptEdit()

  const file = Locator('.TreeItem[aria-label="archive..txt"]')
  await expect(file).toBeVisible()
  await expect(file).toHaveId('TreeItemActive')
}
