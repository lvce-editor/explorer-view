import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-cut-file'

export const skip = ['webkit']

export const test: Test = async ({ ClipBoard, Command, ContextMenu, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
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
