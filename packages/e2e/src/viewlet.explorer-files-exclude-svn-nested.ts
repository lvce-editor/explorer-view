import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-svn-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/project/.svn`)
  await FileSystem.writeFile(`${tmpDir}/project/.svn/entries`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const svnFolder = Locator('.TreeItem[aria-label=".svn"]')
  const treeItems = Locator('.TreeItem')
  await expect(svnFolder).toBeHidden()
  await expect(treeItems).toHaveCount(1)
}
