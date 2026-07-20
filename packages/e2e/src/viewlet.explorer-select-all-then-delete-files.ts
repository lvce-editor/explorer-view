import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-all-then-delete-files'

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 10 }, (_, index) => ({
      content: `content ${index}`,
      uri: `${tmpDir}/file-${index}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(9)

  // act
  await Explorer.selectAll()
  await Explorer.removeDirent()

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(0)
}
