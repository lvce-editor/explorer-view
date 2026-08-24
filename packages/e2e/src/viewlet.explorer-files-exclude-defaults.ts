import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-defaults'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await FileSystem.mkdir(`${tmpDir}/.svn`)
  await FileSystem.mkdir(`${tmpDir}/.hg`)
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/.DS_Store` },
    { content: '', uri: `${tmpDir}/Thumbs.db` },
    { content: '', uri: `${tmpDir}/visible.txt` },
  ])
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)

  const treeItems = Locator('.TreeItem')
  const visibleFile = Locator('.TreeItem[aria-label="visible.txt"]')
  await expect(treeItems).toHaveCount(1)
  await expect(visibleFile).toBeVisible()
}
