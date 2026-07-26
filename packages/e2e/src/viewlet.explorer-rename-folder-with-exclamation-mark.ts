import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-folder-with-exclamation-mark'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Explorer.renameDirent()
  await Explorer.updateEditingValue('important!')
  await Explorer.acceptEdit()

  const original = Locator('.TreeItem[aria-label="folder"]')
  const renamed = Locator('.TreeItem[aria-label="important!"]')
  await expect(original).toBeHidden()
  await expect(renamed).toBeVisible()
  await expect(renamed).toHaveId('TreeItemActive')
}
