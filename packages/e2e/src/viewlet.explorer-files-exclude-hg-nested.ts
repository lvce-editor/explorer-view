import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-hg-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/project/.hg`)
  await FileSystem.writeFile(`${tmpDir}/project/.hg/requires`, '')
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const hgFolder = Locator('.TreeItem[aria-label=".hg"]')
  const treeItems = Locator('.TreeItem')
  await expect(hgFolder).toBeHidden()
  await expect(treeItems).toHaveCount(1)
}
