import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-cut-cancel'

export const test: Test = async ({ Command, FileSystem, Workspace, Explorer, expect, Locator, ClipBoard }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  // act
  await Explorer.handleCut()
  const treeItem = Locator('.TreeItem[data-index="1"]')
  const treeItemLabel = treeItem.locator('.Label')
  await expect(treeItemLabel).toHaveClass('LabelCut')

  await Command.execute('Explorer.handleEscape')
  await expect(treeItemLabel).toHaveJSProperty('className', 'Label')
}
