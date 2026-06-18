import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-expanded-folder-hides-children-and-focuses-next'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder-1`)
  await FileSystem.writeFile(`${tmpDir}/folder-1/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-1/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-1/c.txt`, '')
  await FileSystem.mkdir(`${tmpDir}/folder-2`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  const folder1 = Locator('.TreeItem[aria-label="folder-1"]')
  const folder2 = Locator('.TreeItem[aria-label="folder-2"]')
  const fileA = Locator('.TreeItem[aria-label="a.txt"]')
  const fileB = Locator('.TreeItem[aria-label="b.txt"]')
  const fileC = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(fileA).toBeVisible()
  await expect(fileB).toBeVisible()
  await expect(fileC).toBeVisible()

  // act
  await Explorer.removeDirent()

  // assert
  await expect(folder1).toBeHidden()
  await expect(fileA).toBeHidden()
  await expect(fileB).toBeHidden()
  await expect(fileC).toBeHidden()
  await expect(folder2).toBeVisible()
  await expect(folder2).toHaveId('TreeItemActive')
}
