import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-reveal-folder'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await FileSystem.writeFile(`${tmpDir}/visible.txt`, '')
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  const visible = Locator('.TreeItem[aria-label="visible.txt"]')
  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  const explorer = Locator('.Explorer')
  await Command.execute('Explorer.reveal', `${tmpDir}/.git`)

  await expect(explorer).toBeVisible()
  await expect(gitFolder).toBeHidden()
  await expect(visible).toHaveId('TreeItemActive')
}
