import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder-with-apostrophe'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  await Explorer.newFolder()
  await Explorer.updateEditingValue("team's notes")
  await Explorer.acceptEdit()

  const folder = Locator(`.TreeItem[aria-label="team's notes"]`)
  await expect(folder).toBeVisible()
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(folder).toHaveId('TreeItemActive')
}
