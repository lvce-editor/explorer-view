import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-copy-path-scrolled'

export const skip = ['webkit']

export const test: Test = async ({ ClipBoard, ContextMenu, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 80 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(2, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(40)

  // act
  await Explorer.openContextMenu(40)
  await ContextMenu.selectItem('Copy Path')

  // assert
  await ClipBoard.shouldHaveText('memfs:///workspace/file-40.txt')
}
