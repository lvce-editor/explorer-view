import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-external-delete-parent-while-child-focused'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/sibling.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  // act
  await FileSystem.remove(`${tmpDir}/folder`)
  await Explorer.refresh()

  // assert
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const child = Locator('.TreeItem[aria-label="child.txt"]')
  const sibling = Locator('.TreeItem[aria-label="sibling.txt"]')
  await expect(folder).toBeHidden()
  await expect(child).toBeHidden()
  await expect(sibling).toBeVisible()
  await expect(sibling).toHaveId('TreeItemActive')
}
