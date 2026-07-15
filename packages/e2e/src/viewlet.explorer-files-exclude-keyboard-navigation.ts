import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-keyboard-navigation'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.tmp`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Settings.update({ 'files.exclude': { '**/*.tmp': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.selectDown()

  const lastFile = Locator('.TreeItem[aria-label="c.txt"]')
  const excludedFile = Locator('.TreeItem[aria-label="b.tmp"]')
  await expect(lastFile).toHaveId('TreeItemActive')
  await expect(excludedFile).toBeHidden()
}
