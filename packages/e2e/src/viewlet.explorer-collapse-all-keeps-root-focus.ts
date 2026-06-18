import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-collapse-all-keeps-root-focus'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder/nested/deep`)
  await FileSystem.writeFile(`${tmpDir}/folder/nested/deep/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusLast()
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const deepFile = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(deepFile).toHaveId('TreeItemActive')

  // act
  await Explorer.collapseAll()

  // assert
  await expect(folder).toBeVisible()
  await expect(folder).toHaveId('TreeItemActive')
  await expect(deepFile).toBeHidden()
}
