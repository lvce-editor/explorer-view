import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-refresh-button'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.refresh()

  // assert - items remain visible after refresh
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  await expect(file1).toBeVisible()
  await expect(file2).toBeVisible()
}
