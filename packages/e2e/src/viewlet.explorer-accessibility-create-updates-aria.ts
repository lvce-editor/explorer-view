import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-accessibility-create-updates-aria'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Explorer.focusIndex(0)
  await Explorer.newFile()
  await Explorer.updateEditingValue('b.txt')
  await Explorer.acceptEdit()

  // assert
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(folder).toHaveAttribute('aria-setsize', '1')
  await expect(a).toHaveAttribute('aria-posinset', '1')
  await expect(a).toHaveAttribute('aria-setsize', '2')
  await expect(b).toHaveAttribute('aria-posinset', '2')
  await expect(b).toHaveAttribute('aria-setsize', '2')
}
