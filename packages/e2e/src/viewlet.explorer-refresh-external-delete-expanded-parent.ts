import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-delete-expanded-parent'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder/nested`)
  await FileSystem.writeFile(`${tmpDir}/folder/nested/file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/sibling.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(2)
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const nested = Locator('.TreeItem[aria-label="nested"]')
  const nestedFile = Locator('.TreeItem[aria-label="file.txt"]')
  const sibling = Locator('.TreeItem[aria-label="sibling.txt"]')
  await expect(nestedFile).toHaveId('TreeItemActive')

  // act
  await FileSystem.remove(`${tmpDir}/folder`)
  await Explorer.refresh()

  // assert
  await expect(folder).toBeHidden()
  await expect(nested).toBeHidden()
  await expect(nestedFile).toBeHidden()
  await expect(sibling).toBeVisible()
  await expect(sibling).toHaveId('TreeItemActive')
}
