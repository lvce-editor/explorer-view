import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-create-file'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/visible.txt`, '')
  await Settings.update({ 'files.exclude': { '**/*.tmp': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.newFile()
  await Explorer.updateEditingValue('created.tmp')
  await Explorer.acceptEdit()

  const excludedFile = Locator('.TreeItem[aria-label="created.tmp"]')
  const visibleFile = Locator('.TreeItem[aria-label="visible.txt"]')
  await expect(excludedFile).toBeHidden()
  await expect(visibleFile).toBeVisible()
}
