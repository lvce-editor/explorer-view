import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-copy-path-nested-targets-menu-item'

export const test: Test = async ({ ClipBoard, ContextMenu, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/nested.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(2)

  // act
  await Explorer.openContextMenu(1)
  await ContextMenu.selectItem('Copy Path')

  // assert
  await ClipBoard.shouldHaveText('memfs:///workspace/folder/nested.txt')
}
