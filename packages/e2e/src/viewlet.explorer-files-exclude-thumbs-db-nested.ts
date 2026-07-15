import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-thumbs-db-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/images`)
  await FileSystem.writeFile(`${tmpDir}/images/Thumbs.db`, '')
  await FileSystem.writeFile(`${tmpDir}/images/photo.png`, '')
  await Settings.update({ 'files.exclude': { '**/.DS_Store': true, '**/.git': true, '**/.hg': true, '**/.svn': true, '**/Thumbs.db': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const thumbsDb = Locator('.TreeItem[aria-label="Thumbs.db"]')
  const photo = Locator('.TreeItem[aria-label="photo.png"]')
  await expect(thumbsDb).toBeHidden()
  await expect(photo).toBeVisible()
}
