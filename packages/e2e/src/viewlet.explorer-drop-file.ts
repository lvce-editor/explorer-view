import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-file'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/new`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.handleDragOverIndex(0)

  // act
  const opfsRoot = await navigator.storage.getDirectory()
  const fileHandle = await opfsRoot.getFileHandle('my first file', {
    create: true,
  })
  const fileHandles = [fileHandle]
  const files = []
  const paths = []
  const index = 0
  await Command.execute('Explorer.handleDropIndex', fileHandles, files, paths, index)

  // assert
  const newFile = Locator('.TreeItem[aria-label="my first file"]')
  await expect(newFile).toBeVisible()
}
