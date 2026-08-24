import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-cut-then-copy-clears-cut-decoration'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.setFiles([
    { content: 'cut', uri: `${tmpDir}/a/cut.txt` },
    { content: 'copy', uri: `${tmpDir}/copy.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)
  await Explorer.handleCut()
  const cutLabel = Locator('.TreeItem[data-index="1"] .Label')
  await expect(cutLabel).toHaveClass('LabelCut')

  // act
  await Explorer.focusIndex(2)
  await Explorer.handleCopy()

  // assert
  await expect(cutLabel).toHaveJSProperty('className', 'Label')
}
