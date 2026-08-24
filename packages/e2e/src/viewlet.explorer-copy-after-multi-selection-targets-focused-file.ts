import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-after-multi-selection-targets-focused-file'

export const test: Test = async ({ ClipBoard, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await FileSystem.mkdir(`${tmpDir}/target`)
  await Workspace.setPath(tmpDir)
  await Explorer.selectIndices([1, 2])

  // act
  await Explorer.focusIndex(3)
  await Explorer.handleCopy()
  await Explorer.focusIndex(0)
  await Explorer.handlePaste()

  // assert
  await FileSystem.shouldHaveFile(`${tmpDir}/target/c.txt`, '')
}
