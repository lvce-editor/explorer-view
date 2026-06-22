import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-paste-file'

export const test: Test = async ({ ClipBoard, ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
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
