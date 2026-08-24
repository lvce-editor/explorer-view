import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-cut-file'

export const skip = ['webkit']

export const test: Test = async ({ ClipBoard, Command, ContextMenu, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.openContextMenu(1)
  await ContextMenu.selectItem('Cut')

  // assert - file should have cut decoration
  const treeItem = Locator('.TreeItem[data-index="1"]')
  const treeItemLabel = treeItem.locator('.Label')
  await expect(treeItemLabel).toHaveClass('LabelCut')

  // act - cancel the cut operation
  await KeyBoard.press('Escape')
  await Command.execute('Timeout.sleep', 100)

  // assert - file should no longer have cut decoration
  await expect(treeItemLabel).toHaveJSProperty('className', 'Label')
}
