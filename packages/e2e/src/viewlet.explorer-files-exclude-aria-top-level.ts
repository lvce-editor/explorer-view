import type { Test } from '@lvce-editor/test-with-playwright'
import { setExcludes } from './_setExcludes.ts'

export const name = 'viewlet.explorer-files-exclude-aria-top-level'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.tmp`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await setExcludes(Settings, { '**/*.tmp': true })
  await Workspace.setPath(tmpDir)

  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const c = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(a).toHaveAttribute('aria-posinset', '1')
  await expect(a).toHaveAttribute('aria-setsize', '2')
  await expect(c).toHaveAttribute('aria-posinset', '2')
  await expect(c).toHaveAttribute('aria-setsize', '2')
}
