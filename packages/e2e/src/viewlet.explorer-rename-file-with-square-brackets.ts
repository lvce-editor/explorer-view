import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-with-square-brackets'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Explorer.renameDirent()
  await Explorer.updateEditingValue('notes [draft].txt')
  await Explorer.acceptEdit()

  const original = Locator('.TreeItem[aria-label="file.txt"]')
  const renamed = Locator('.TreeItem[aria-label="notes [draft].txt"]')
  await expect(original).toBeHidden()
  await expect(renamed).toBeVisible()
  await expect(renamed).toHaveId('TreeItemActive')
}
