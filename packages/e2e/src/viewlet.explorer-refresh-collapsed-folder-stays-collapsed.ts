import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-collapsed-folder-stays-collapsed'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/one.txt`, 'one')
  await Workspace.setPath(tmpDir)
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const one = Locator('.TreeItem[aria-label="one.txt"]')
  const two = Locator('.TreeItem[aria-label="two.txt"]')
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(one).toBeHidden()

  // act
  await FileSystem.writeFile(`${tmpDir}/folder/two.txt`, 'two')
  await Explorer.refresh()

  // assert
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(one).toBeHidden()
  await expect(two).toBeHidden()

  // act
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()

  // assert
  await expect(one).toBeVisible()
  await expect(two).toBeVisible()
}
