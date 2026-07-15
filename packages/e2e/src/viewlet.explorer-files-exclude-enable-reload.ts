import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-enable-reload'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await Settings.update({ 'files.exclude': {} })
  await Workspace.setPath(tmpDir)
  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  await expect(gitFolder).toBeVisible()

  await Settings.update({ 'files.exclude': { '**/.git': true } })
  await Workspace.setPath('')
  await Workspace.setPath(tmpDir)
  await expect(gitFolder).toBeHidden()
}
