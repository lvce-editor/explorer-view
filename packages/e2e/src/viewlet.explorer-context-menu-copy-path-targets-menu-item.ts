import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-copy-path-targets-menu-item'

export const skip = ['webkit']

export const test: Test = async ({ ClipBoard, ContextMenu, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  // act
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('Copy Path')

  // assert
  await ClipBoard.shouldHaveText('memfs:///workspace/file1.txt')
}
