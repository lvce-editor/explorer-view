import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-over-collapsed-folder-then-drop'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/target`)
  await Workspace.setPath(tmpDir)
  const opfsRoot = await navigator.storage.getDirectory()
  const fileHandle = await opfsRoot.getFileHandle('dropped.txt', { create: true })

  // act
  await Explorer.handleDragOverIndex(0)
  await Explorer.handleDropIndex([fileHandle], [], [], 0)

  // assert
  const target = Locator('.TreeItem[aria-label="target"]')
  const dropped = Locator(`.TreeItem[title="${tmpDir}/target/dropped.txt"]`)
  await expect(target).toHaveAttribute('aria-expanded', 'true')
  await expect(dropped).toBeVisible()
}
