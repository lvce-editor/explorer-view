import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-ds-store-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/images`)
  await FileSystem.writeFile(`${tmpDir}/images/.DS_Store`, '')
  await FileSystem.writeFile(`${tmpDir}/images/photo.png`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const excludedFile = Locator('.TreeItem[aria-label=".DS_Store"]')
  const photo = Locator('.TreeItem[aria-label="photo.png"]')
  await expect(excludedFile).toBeHidden()
  await expect(photo).toBeVisible()
}
