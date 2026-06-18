import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-create-in-expanded-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/one.txt`, 'one')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const one = Locator('.TreeItem[aria-label="one.txt"]')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await expect(one).toBeVisible()

  // act
  await FileSystem.writeFile(`${tmpDir}/folder/two.txt`, 'two')
  await Explorer.refresh()

  // assert
  const two = Locator('.TreeItem[aria-label="two.txt"]')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await expect(one).toBeVisible()
  await expect(two).toBeVisible()
}
