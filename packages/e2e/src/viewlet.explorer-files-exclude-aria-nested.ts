import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-aria-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder/b.tmp`, '')
  await FileSystem.writeFile(`${tmpDir}/folder/c.txt`, '')
  await Settings.update({ 'files.exclude': { '**/*.tmp': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const c = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(a).toHaveAttribute('aria-level', '2')
  await expect(a).toHaveAttribute('aria-posinset', '1')
  await expect(a).toHaveAttribute('aria-setsize', '2')
  await expect(c).toHaveAttribute('aria-posinset', '2')
  await expect(c).toHaveAttribute('aria-setsize', '2')
}
