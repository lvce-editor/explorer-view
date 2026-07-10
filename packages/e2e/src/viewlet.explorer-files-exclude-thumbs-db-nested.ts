import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-thumbs-db-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/images`)
  await FileSystem.writeFile(`${tmpDir}/images/Thumbs.db`, '')
  await FileSystem.writeFile(`${tmpDir}/images/photo.png`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const thumbsDb = Locator('.TreeItem[aria-label="Thumbs.db"]')
  const photo = Locator('.TreeItem[aria-label="photo.png"]')
  await expect(thumbsDb).toBeHidden()
  await expect(photo).toBeVisible()
}
