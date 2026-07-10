import type { Test } from '@lvce-editor/test-with-playwright'
import { setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-refresh-create'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/visible.txt`, '')
  await setExcludes(Settings, { '**/*.tmp': true })
  await Workspace.setPath(tmpDir)
  await FileSystem.writeFile(`${tmpDir}/created.tmp`, '')
  await Explorer.refresh()

  const createdFile = Locator('.TreeItem[aria-label="created.tmp"]')
  const treeItems = Locator('.TreeItem')
  await expect(createdFile).toBeHidden()
  await expect(treeItems).toHaveCount(1)
}
