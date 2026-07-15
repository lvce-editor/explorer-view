import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-ds-store-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/images`)
  await FileSystem.writeFile(`${tmpDir}/images/.DS_Store`, '')
  await FileSystem.writeFile(`${tmpDir}/images/photo.png`, '')
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const excludedFile = Locator('.TreeItem[aria-label=".DS_Store"]')
  const photo = Locator('.TreeItem[aria-label="photo.png"]')
  await expect(excludedFile).toBeHidden()
  await expect(photo).toBeVisible()
}
