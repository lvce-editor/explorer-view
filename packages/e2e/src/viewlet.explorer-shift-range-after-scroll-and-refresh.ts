import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-shift-range-after-scroll-and-refresh'

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
  await Explorer.selectIndices([10, 11, 12, 13, 14, 15])
  await Explorer.focusIndex(90)

  // act
  await Explorer.refresh()

  // assert
  const focused = Locator('.TreeItem[aria-label="file-090.txt"]')
  await expect(focused).toBeVisible()
  await expect(focused).toHaveId('TreeItemActive')
}
