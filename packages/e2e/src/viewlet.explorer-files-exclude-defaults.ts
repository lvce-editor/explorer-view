import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-defaults'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await FileSystem.mkdir(`${tmpDir}/.svn`)
  await FileSystem.mkdir(`${tmpDir}/.hg`)
  await FileSystem.writeFile(`${tmpDir}/.DS_Store`, '')
  await FileSystem.writeFile(`${tmpDir}/Thumbs.db`, '')
  await FileSystem.writeFile(`${tmpDir}/visible.txt`, '')
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)

  const treeItems = Locator('.TreeItem')
  const visibleFile = Locator('.TreeItem[aria-label="visible.txt"]')
  await expect(treeItems).toHaveCount(1)
  await expect(visibleFile).toBeVisible()
}
