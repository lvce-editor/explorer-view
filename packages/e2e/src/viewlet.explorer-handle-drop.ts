import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-handle-drop'

export const skip = 1

export const test: Test = async ({ Command, FileSystem, Workspace, Explorer, ContextMenu, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  const directory = await navigator.storage.getDirectory()
  const fileHandle = await directory.getFileHandle('my first file', {
    create: true,
  })
  const file = await fileHandle.getFile()
  const fileList = [file]
  const id = await Command.execute('FileSystemHandle.addFileHandle')
  // act

  await Command.execute('Explorer.handleDrop', 0, 0, [id], fileList)
}
