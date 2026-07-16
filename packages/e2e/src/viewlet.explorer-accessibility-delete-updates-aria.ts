import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-accessibility-delete-updates-aria'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Explorer.focusIndex(2)
  await Explorer.removeDirent()

  // assert
  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  const c = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(a).toHaveAttribute('aria-level', '2')
  await expect(a).toHaveAttribute('aria-posinset', '1')
  await expect(a).toHaveAttribute('aria-setsize', '2')
  await expect(b).toBeHidden()
  await expect(c).toHaveAttribute('aria-level', '2')
  await expect(c).toHaveAttribute('aria-posinset', '2')
  await expect(c).toHaveAttribute('aria-setsize', '2')
}
