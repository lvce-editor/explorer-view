import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-reveal-descendant'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/project/.git`)
  await FileSystem.writeFile(`${tmpDir}/project/.git/config`, '')
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  const project = Locator('.TreeItem[aria-label="project"]')
  const config = Locator('.TreeItem[aria-label="config"]')
  const explorer = Locator('.Explorer')
  await Command.execute('Explorer.reveal', `${tmpDir}/project/.git/config`)

  await expect(explorer).toBeVisible()
  await expect(config).toBeHidden()
  await expect(project).toHaveId('TreeItemActive')
  await expect(project).toHaveAttribute('aria-expanded', 'false')
}
