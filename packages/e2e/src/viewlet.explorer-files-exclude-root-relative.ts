import type { Test } from '@lvce-editor/test-with-playwright'
import { setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-root-relative'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/src/generated`)
  await FileSystem.mkdir(`${tmpDir}/packages/src/generated`)
  await setExcludes(Settings, { 'src/generated': true })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const rootGenerated = Locator(`.TreeItem[title="${tmpDir}/src/generated"]`)
  const nestedGenerated = Locator(`.TreeItem[title="${tmpDir}/packages/src/generated"]`)
  await expect(rootGenerated).toBeHidden()
  await expect(nestedGenerated).toBeVisible()
}
