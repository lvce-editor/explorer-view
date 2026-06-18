import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-expanded-folder-aria-multiple-children'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act
  await Explorer.clickCurrent()

  // assert
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const firstChild = Locator('.TreeItem[aria-label="a.txt"]')
  const secondChild = Locator('.TreeItem[aria-label="b.txt"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(folder).toHaveAttribute('aria-level', '1')
  await expect(folder).toHaveAttribute('aria-posinset', '1')
  await expect(folder).toHaveAttribute('aria-setsize', '2')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await expect(firstChild).toHaveAttribute('aria-level', '2')
  await expect(firstChild).toHaveAttribute('aria-posinset', '1')
  await expect(firstChild).toHaveAttribute('aria-setsize', '2')
  await expect(secondChild).toHaveAttribute('aria-level', '2')
  await expect(secondChild).toHaveAttribute('aria-posinset', '2')
  await expect(secondChild).toHaveAttribute('aria-setsize', '2')
  await expect(rootFile).toHaveAttribute('aria-level', '1')
  await expect(rootFile).toHaveAttribute('aria-posinset', '2')
  await expect(rootFile).toHaveAttribute('aria-setsize', '2')
}
