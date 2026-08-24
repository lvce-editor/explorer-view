import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-handle-drop'

export const skip = ['webkit']

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  const directory = await navigator.storage.getDirectory()
  const fileHandle = await directory.getFileHandle('dropped-file.txt', {
    create: true,
  })
  const file = await fileHandle.getFile()
  const fileList = [file]
  const id = await FileSystem.registerFileHandle(fileHandle)

  // act
  await Explorer.handleDrop(0, 0, [id], fileList)

  // assert
  const droppedFile = Locator('.TreeItem', { hasText: 'dropped-file.txt' })
  await expect(droppedFile).toBeVisible()
}
