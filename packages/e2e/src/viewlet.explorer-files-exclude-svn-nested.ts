import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-svn-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/project/.svn`)
  await FileSystem.writeFile(`${tmpDir}/project/.svn/entries`, '')
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const svnFolder = Locator('.TreeItem[aria-label=".svn"]')
  const treeItems = Locator('.TreeItem')
  await expect(svnFolder).toBeHidden()
  await expect(treeItems).toHaveCount(1)
}
