import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-gitignore-visible'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await FileSystem.writeFile(`${tmpDir}/.gitignore`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)

  const gitIgnore = Locator('.TreeItem[aria-label=".gitignore"]')
  const treeItems = Locator('.TreeItem')
  await expect(gitIgnore).toBeVisible()
  await expect(treeItems).toHaveCount(1)
}
