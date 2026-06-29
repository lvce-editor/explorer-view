import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-collapsed-folder-with-selected-hidden-child'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, 'child')
  await FileSystem.writeFile(`${tmpDir}/sibling.txt`, 'sibling')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.selectIndices([1])
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const child = Locator('.TreeItem[aria-label="child.txt"]')

  // act
  await Explorer.removeDirent()

  // assert
  const sibling = Locator('.TreeItem[aria-label="sibling.txt"]')
  await expect(folder).toBeHidden()
  await expect(child).toBeHidden()
  await expect(sibling).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/sibling.txt`, 'sibling')
}
