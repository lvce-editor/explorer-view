import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-similar-github-visible'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await FileSystem.mkdir(`${tmpDir}/.github`)
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)

  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  const githubFolder = Locator('.TreeItem[aria-label=".github"]')
  await expect(gitFolder).toBeHidden()
  await expect(githubFolder).toBeVisible()
}
