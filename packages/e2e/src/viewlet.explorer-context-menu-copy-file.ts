import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-copy-file'

export const skip = ['webkit']

export const test: Test = async ({ ClipBoard, ContextMenu, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
  ])
  await FileSystem.mkdir(`${tmpDir}/target`)
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.openContextMenu(2)
  await ContextMenu.selectItem('Copy')
  await Explorer.focusIndex(0)
  await Explorer.handlePaste()

  // assert
  await FileSystem.shouldHaveFile(`${tmpDir}/target/file2.txt`, 'content 2')
}
