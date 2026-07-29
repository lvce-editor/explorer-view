import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-previous-next-across-viewport'

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

  // act
  await Explorer.focusIndex(90)
  await Explorer.focusPrevious()
  await Explorer.focusNext()

  // assert
  const file90 = Locator('.TreeItem[aria-label="file-090.txt"]')
  await expect(file90).toBeVisible()
  await expect(file90).toHaveId('TreeItemActive')
}
