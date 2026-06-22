import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-accessibility-files-no-aria-expanded'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/nested.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // assert
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  const nestedFile = Locator('.TreeItem[aria-label="nested.txt"]')
  await expect(rootFile).toHaveAttribute('aria-expanded', null)
  await expect(nestedFile).toHaveAttribute('aria-expanded', null)
}
