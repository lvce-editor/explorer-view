import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-range-select-across-scroll-boundary'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 120 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(3, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(5)

  // act
  await Explorer.handleClickAt(false, 0, false, false, 300, 100)
  await Explorer.focusIndex(90)
  await Explorer.handleClickAt(false, 0, false, true, 300, 100)

  // assert
  const first = Locator('.TreeItem[aria-label="file-005.txt"]')
  const middle = Locator('.TreeItem[aria-label="file-050.txt"]')
  const last = Locator('.TreeItem[aria-label="file-090.txt"]')
  await expect(last).toHaveClass('TreeItemActive')
  await Explorer.focusIndex(50)
  await expect(middle).toHaveClass('TreeItemActive')
  await Explorer.focusIndex(5)
  await expect(first).toHaveClass('TreeItemActive')
}
