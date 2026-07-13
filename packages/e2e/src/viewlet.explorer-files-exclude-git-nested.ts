import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-git-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/project/.git`)
  await FileSystem.writeFile(`${tmpDir}/project/.git/config`, '')
  await FileSystem.writeFile(`${tmpDir}/project/readme.md`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  const readme = Locator('.TreeItem[aria-label="readme.md"]')
  await expect(gitFolder).toBeHidden()
  await expect(readme).toBeVisible()
}
