import type { Test } from '@lvce-editor/test-with-playwright'
import { setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-extension-glob'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/dist`)
  await FileSystem.writeFile(`${tmpDir}/dist/app.js`, '')
  await FileSystem.writeFile(`${tmpDir}/dist/app.js.map`, '')
  await setExcludes(Settings, { '**/*.map': true })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const sourceMap = Locator('.TreeItem[aria-label="app.js.map"]')
  const javascriptFile = Locator('.TreeItem[aria-label="app.js"]')
  await expect(sourceMap).toBeHidden()
  await expect(javascriptFile).toBeVisible()
}
