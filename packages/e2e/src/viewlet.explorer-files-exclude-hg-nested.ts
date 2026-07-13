import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-hg-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/project/.hg`)
  await FileSystem.writeFile(`${tmpDir}/project/.hg/requires`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const hgFolder = Locator('.TreeItem[aria-label=".hg"]')
  const treeItems = Locator('.TreeItem')
  await expect(hgFolder).toBeHidden()
  await expect(treeItems).toHaveCount(1)
}
