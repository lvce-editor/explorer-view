import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-cut-multiple-files'

export const skip = ['webkit']

export const test: Test = async ({ ClipBoard, ContextMenu, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
    { content: 'content 4', uri: `${tmpDir}/file4.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.selectIndices([0, 1, 2])

  // act
  await Explorer.openContextMenu(1)
  await ContextMenu.selectItem('Cut')

  // assert
  const cutLabels = Locator('.TreeItem .Label.LabelCut')
  await expect(cutLabels).toHaveCount(3)
  await expect(Locator('.TreeItem[data-index="3"] .Label')).toHaveClass('Label')

  // act - cancel the cut operation
  await KeyBoard.press('Escape')

  // assert
  await expect(Locator('.TreeItem .Label.LabelCut')).toHaveCount(0)
}
