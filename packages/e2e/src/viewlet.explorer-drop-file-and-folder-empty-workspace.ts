import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-file-and-folder-empty-workspace'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Workspace.setPath('')
  const opfsRoot = await navigator.storage.getDirectory()
  const fileHandle = await opfsRoot.getFileHandle('dropped-file.txt', {
    create: true,
  })
  const directoryHandle = await opfsRoot.getDirectoryHandle('mixed-dropped-workspace-folder', {
    create: true,
  })
  const nestedFileHandle = await directoryHandle.getFileHandle('folder-inside.txt', {
    create: true,
  })
  const writable = await nestedFileHandle.createWritable({ keepExistingData: false })
  await writable.write('folder')
  await writable.close()
  const fileId = (await FileSystem.addFileHandle(fileHandle)) as unknown as number
  const directoryId = (await FileSystem.addFileHandle(directoryHandle)) as unknown as number
  const welcomeMessage = Locator('.Explorer .WelcomeMessage')
  const nestedFile = Locator('.TreeItem[aria-label="folder-inside.txt"]')
  const droppedFile = Locator('.TreeItem[aria-label="dropped-file.txt"]')

  // act
  await Explorer.handleDrop(5000, 5000, [fileId, directoryId], [] as any)

  // assert
  await expect(welcomeMessage).toBeHidden()
  await expect(nestedFile).toBeVisible()
  await expect(droppedFile).toHaveCount(0)
}
