import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-and-paste-multiple-files'

export const test: Test = async ({ ClipBoard, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  const firstUri = `${tmpDir}/first.txt`
  const secondUri = `${tmpDir}/second.txt`
  await FileSystem.setFiles([
    { content: 'first', uri: firstUri },
    { content: 'second', uri: secondUri },
  ])
  await FileSystem.mkdir(`${tmpDir}/target`)
  await Workspace.setUri(tmpDir)
  await Explorer.focusIndex(1)
  await Explorer.selectIndices([1, 2])

  // act
  await Explorer.handleCopy()
  await Explorer.focusIndex(0)
  await Explorer.handlePaste()

  // assert
  await FileSystem.shouldHaveFile(`${tmpDir}/target/first.txt`, 'first')
  await FileSystem.shouldHaveFile(`${tmpDir}/target/second.txt`, 'second')
  await FileSystem.shouldHaveFile(firstUri, 'first')
  await FileSystem.shouldHaveFile(secondUri, 'second')
}
