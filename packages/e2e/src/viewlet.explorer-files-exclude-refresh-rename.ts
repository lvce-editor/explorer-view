import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-refresh-rename'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/before.txt`, '')
  await Settings.update({ 'files.exclude': { '**/*.tmp': true } })
  await Workspace.setPath(tmpDir)
  await FileSystem.remove(`${tmpDir}/before.txt`)
  await FileSystem.writeFile(`${tmpDir}/after.tmp`, '')
  await Explorer.refresh()

  const before = Locator('.TreeItem[aria-label="before.txt"]')
  const after = Locator('.TreeItem[aria-label="after.tmp"]')
  const treeItems = Locator('.TreeItem')
  await expect(before).toBeHidden()
  await expect(after).toBeHidden()
  await expect(treeItems).toHaveCount(0)
}
