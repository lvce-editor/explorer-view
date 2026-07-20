import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder-with-greek-characters'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.newFolder()
  await Explorer.updateEditingValue('δοκιμή')
  await Explorer.acceptEdit()

  const folder = Locator('.TreeItem[aria-label="δοκιμή"]')
  await expect(folder).toBeVisible()
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(folder).toHaveId('TreeItemActive')
}
