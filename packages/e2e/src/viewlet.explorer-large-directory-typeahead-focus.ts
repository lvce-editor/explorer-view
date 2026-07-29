import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-large-directory-typeahead-focus'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/alpha.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/banana.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/berry.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/cherry.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.handleKeyDown(false, 'b')

  // assert
  const banana = Locator('.TreeItem[aria-label="banana.txt"]')
  await expect(banana).toHaveId('TreeItemActive')

  // act
  await Explorer.handleKeyDown(false, 'e')

  // assert
  const berry = Locator('.TreeItem[aria-label="berry.txt"]')
  await expect(berry).toHaveId('TreeItemActive')
}
