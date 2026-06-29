import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-path-special-root-path'

export const test: Test = async ({ ClipBoard, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  const root = `${tmpDir}/root with spaces [x] cafe`
  await FileSystem.mkdir(`${root}/folder`)
  await FileSystem.writeFile(`${root}/folder/file name.txt`, '')
  await Workspace.setPath(root)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  // act
  await Explorer.copyPath()

  // assert
  await ClipBoard.shouldHaveText(`${root}/folder/file name.txt`)
}
