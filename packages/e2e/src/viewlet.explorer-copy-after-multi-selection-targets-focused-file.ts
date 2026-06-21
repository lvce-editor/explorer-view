import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-after-multi-selection-targets-focused-file'

export const skip = 1

export const test: Test = async ({ ClipBoard, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.selectIndices([0, 1])

  // act
  await Explorer.focusIndex(2)
  await Explorer.handleCopy()

  // assert
  await ClipBoard.shouldHaveText('memfs:///workspace/c.txt')
}
