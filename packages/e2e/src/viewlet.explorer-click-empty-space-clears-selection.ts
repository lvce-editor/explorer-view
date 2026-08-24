import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-click-empty-space-clears-selection'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.selectIndices([0])

  const focusedListItems = Locator('.Explorer .ListItems.FocusOutline')
  const file1 = Locator('.TreeItem').nth(0)
  const file2 = Locator('.TreeItem').nth(1)

  // act
  await Explorer.handleClickAt(false, 0, false, false, 20, 10_000)

  // assert
  await expect(focusedListItems).toBeVisible()
  await expect(file1).toHaveClass('TreeItem')
  await expect(file2).toHaveClass('TreeItem')
}
