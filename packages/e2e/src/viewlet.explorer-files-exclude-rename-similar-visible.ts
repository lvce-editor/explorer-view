import type { Test } from '@lvce-editor/test-with-playwright'
import { defaultExcludes, setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-rename-similar-visible'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/metadata`)
  await setExcludes(Settings, defaultExcludes)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('.git-backup')
  await Explorer.acceptEdit()

  const renamedFolder = Locator('.TreeItem[aria-label=".git-backup"]')
  await expect(renamedFolder).toBeVisible()
  await expect(renamedFolder).toHaveId('TreeItemActive')
}
