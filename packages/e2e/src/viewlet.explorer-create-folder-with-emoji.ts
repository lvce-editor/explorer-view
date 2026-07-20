import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder-with-emoji'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.newFolder()
  await Explorer.updateEditingValue('project-🚀')
  await Explorer.acceptEdit()

  const folder = Locator('.TreeItem[aria-label="project-🚀"]')
  await expect(folder).toBeVisible()
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(folder).toHaveId('TreeItemActive')
}
