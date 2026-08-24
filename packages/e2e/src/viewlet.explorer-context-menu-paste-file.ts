import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-paste-file'

export const skip = 1

export const test: Test = async ({ ClipBoard, ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.handleCopy()

  // act
  await Explorer.openContextMenu(1)
  await ContextMenu.selectItem('Paste')

  // assert
  const pastedFile = Locator('.TreeItem[aria-label="file2 copy.txt"]')
  await expect(pastedFile).toBeVisible()
}
