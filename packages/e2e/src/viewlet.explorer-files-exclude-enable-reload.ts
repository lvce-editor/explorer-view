import type { Test } from '@lvce-editor/test-with-playwright'
import { setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-enable-reload'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/.git`)
  await setExcludes(Settings, {})
  await Workspace.setPath(tmpDir)
  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  await expect(gitFolder).toBeVisible()

  await setExcludes(Settings, { '**/.git': true })
  await Workspace.setPath('')
  await Workspace.setPath(tmpDir)
  await expect(gitFolder).toBeHidden()
}
