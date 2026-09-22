import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-toggle-reload'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await Settings.update({ 'files.exclude': { '**/.git': true } })
  await Workspace.setUri(tmpDir)
  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  await expect(gitFolder).toBeHidden()

  await Settings.update({ 'files.exclude': { '**/.git': false } })
  await Workspace.setUri('')
  await Workspace.setUri(tmpDir)
  await expect(gitFolder).toBeVisible()
}
