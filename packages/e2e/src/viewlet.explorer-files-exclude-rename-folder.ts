import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-rename-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/metadata`)
  await FileSystem.writeFile(`${tmpDir}/visible.txt`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('.git')
  await Explorer.acceptEdit()

  const oldFolder = Locator('.TreeItem[aria-label="metadata"]')
  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  const treeItems = Locator('.TreeItem')
  await expect(oldFolder).toBeHidden()
  await expect(gitFolder).toBeHidden()
  await expect(treeItems).toHaveCount(1)
}
