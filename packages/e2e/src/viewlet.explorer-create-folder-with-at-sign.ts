import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder-with-at-sign'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.newFolder()
  await Explorer.updateEditingValue('contact@example')
  await Explorer.acceptEdit()

  const folder = Locator('.TreeItem[aria-label="contact@example"]')
  await expect(folder).toBeVisible()
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(folder).toHaveId('TreeItemActive')
}
