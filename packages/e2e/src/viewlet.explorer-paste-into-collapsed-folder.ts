import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-paste-into-collapsed-folder'

export const skip = 1

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/target`)
  await FileSystem.writeFile(`${tmpDir}/source.txt`, '')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(1)
  await Explorer.handleCopy()
  await Explorer.focusIndex(0)
  await Explorer.handlePaste()

  // assert
  const target = Locator('.TreeItem[aria-label="target"]')
  const copiedFile = Locator(`.TreeItem[title="${tmpDir}/target/source.txt"]`)
  await expect(target).toHaveAttribute('aria-expanded', 'true')
  await expect(copiedFile).toBeVisible()
}
