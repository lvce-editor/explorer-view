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
  const folder = treeItems.nth(0)
  const input = treeItems.nth(1).locator('input')
  const file = treeItems.nth(2)
  await expect(folder).toHaveAttribute('aria-label', 'folder')
  await expect(input).toBeFocused()
  await expect(file).toHaveAttribute('aria-label', 'file.txt')
}
