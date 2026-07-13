import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-case-sensitive'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/Thumbs.db`, '')
  await FileSystem.writeFile(`${tmpDir}/thumbs.db`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)

  const excludedFile = Locator('.TreeItem[aria-label="Thumbs.db"]')
  const visibleFile = Locator('.TreeItem[aria-label="thumbs.db"]')
  await expect(excludedFile).toBeHidden()
  await expect(visibleFile).toBeVisible()
}
