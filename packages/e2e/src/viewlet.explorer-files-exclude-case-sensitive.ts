import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-case-sensitive'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/Thumbs.db` },
    { content: '', uri: `${tmpDir}/thumbs.db` },
  ])
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)

  const excludedFile = Locator('.TreeItem[aria-label="Thumbs.db"]')
  const visibleFile = Locator('.TreeItem[aria-label="thumbs.db"]')
  await expect(excludedFile).toBeHidden()
  await expect(visibleFile).toBeVisible()
}
