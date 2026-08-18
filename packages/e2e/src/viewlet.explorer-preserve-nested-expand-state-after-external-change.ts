import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-preserve-nested-expand-state-after-external-change'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/outer/inner`)
  await FileSystem.writeFile(`${tmpDir}/outer/inner/existing.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  await FileSystem.writeFile(`${tmpDir}/outer/inner/externally-created.txt`, '')
  await Explorer.refresh()

  const outer = Locator('.TreeItem[aria-label="outer"]')
  const inner = Locator('.TreeItem[aria-label="inner"]')
  const created = Locator('.TreeItem[aria-label="externally-created.txt"]')
  await expect(outer).toHaveAttribute('aria-expanded', 'true')
  await expect(inner).toHaveAttribute('aria-expanded', 'true')
  await expect(created).toBeVisible()
}
