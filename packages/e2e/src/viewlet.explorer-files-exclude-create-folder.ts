import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-create-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/visible.txt`, '')
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.newFolder()
  await Explorer.updateEditingValue('.git')
  await Explorer.acceptEdit()

  const gitFolder = Locator('.TreeItem[aria-label=".git"]')
  const treeItems = Locator('.TreeItem')
  await expect(gitFolder).toBeHidden()
  await expect(treeItems).toHaveCount(1)
}
