import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-false-entry-visible'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await Settings.update({ 'files.exclude': { '**/.git': false } })
  await Workspace.setPath(tmpDir)

  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  await expect(gitFolder).toBeVisible()
}
