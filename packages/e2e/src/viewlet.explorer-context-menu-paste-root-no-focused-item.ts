import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-paste-root-no-focused-item'

export const test: Test = async ({ ClipBoard, ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)
  await Explorer.handleCopy()
  await Explorer.focusIndex(-1)

  // act
  await Explorer.openContextMenu(-1)
  await ContextMenu.selectItem('Paste')

  // assert
  const sourceFile = Locator(`.TreeItem[title="${tmpDir}/a/file.txt"]`)
  await expect(sourceFile).toBeVisible()
  const copiedFile = Locator(`.TreeItem[title="${tmpDir}/file.txt"]`)
  await expect(copiedFile).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.shouldHaveFile(`${tmpDir}/file.txt`, 'content')
}
