import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-new-file-focus-none-folder-boundary'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusNone()

  // act
  await Explorer.newFile()

  // assert
  const treeItems = Locator('.Explorer .TreeItem')
  await expect(treeItems.nth(0)).toHaveAttribute('aria-label', 'folder')
  await expect(treeItems.nth(1).locator('input')).toBeFocused()
  await expect(treeItems.nth(2)).toHaveAttribute('aria-label', 'file.txt')
}
