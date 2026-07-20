import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder-with-spaces'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.newFolder()
  await Explorer.updateEditingValue('folder with spaces')
  await Explorer.acceptEdit()

  const folder = Locator('.TreeItem[aria-label="folder with spaces"]')
  await expect(folder).toBeVisible()
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(folder).toHaveId('TreeItemActive')
}
