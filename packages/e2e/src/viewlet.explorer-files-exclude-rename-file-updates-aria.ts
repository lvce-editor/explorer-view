import type { Test } from '@lvce-editor/test-with-playwright'
import { setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-rename-file-updates-aria'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await setExcludes(Settings, { '**/*.tmp': true })
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('b.tmp')
  await Explorer.acceptEdit()

  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const excludedFile = Locator('.TreeItem[aria-label="b.tmp"]')
  const c = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(excludedFile).toBeHidden()
  await expect(a).toHaveAttribute('aria-posinset', '1')
  await expect(a).toHaveAttribute('aria-setsize', '2')
  await expect(c).toHaveAttribute('aria-posinset', '2')
  await expect(c).toHaveAttribute('aria-setsize', '2')
}
