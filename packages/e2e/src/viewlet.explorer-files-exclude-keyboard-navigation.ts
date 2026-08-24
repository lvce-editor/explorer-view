import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-keyboard-navigation'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.tmp` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await Settings.update({ 'files.exclude': { '**/*.tmp': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.selectDown()

  const lastFile = Locator('.TreeItem[aria-label="c.txt"]')
  const excludedFile = Locator('.TreeItem[aria-label="b.tmp"]')
  await expect(lastFile).toHaveId('TreeItemActive')
  await expect(excludedFile).toBeHidden()
}
