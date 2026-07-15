import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-wildcard-folder'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/cache-linux`)
  await FileSystem.mkdir(`${tmpDir}/cache-windows`)
  await FileSystem.mkdir(`${tmpDir}/cached`)
  await Settings.update({ 'files.exclude': { '**/cache-*': true } })
  await Workspace.setPath(tmpDir)

  const linuxCache = Locator('.TreeItem[aria-label="cache-linux"]')
  const windowsCache = Locator('.TreeItem[aria-label="cache-windows"]')
  const cachedFolder = Locator('.TreeItem[aria-label="cached"]')
  await expect(linuxCache).toBeHidden()
  await expect(windowsCache).toBeHidden()
  await expect(cachedFolder).toBeVisible()
}
