import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-accessibility-refresh-updates-aria'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await FileSystem.writeFile(`${tmpDir}/folder/b.txt`, '')
  await Explorer.refresh()

  // assert
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await expect(a).toHaveAttribute('aria-level', '2')
  await expect(a).toHaveAttribute('aria-posinset', '1')
  await expect(a).toHaveAttribute('aria-setsize', '2')
  await expect(b).toHaveAttribute('aria-level', '2')
  await expect(b).toHaveAttribute('aria-posinset', '2')
  await expect(b).toHaveAttribute('aria-setsize', '2')
}
