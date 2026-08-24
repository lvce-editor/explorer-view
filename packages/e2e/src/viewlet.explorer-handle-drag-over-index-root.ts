import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-handle-drag-over-index-root'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'a', uri: `${tmpDir}/file-1.txt` },
    { content: 'b', uri: `${tmpDir}/file-2.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.handleDragOverIndex(-1)

  // assert
  const explorer = Locator('.Explorer .ListItems')
  await expect(explorer).toHaveClass('DropTarget')
}
