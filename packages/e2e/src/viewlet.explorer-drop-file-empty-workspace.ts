import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-file-empty-workspace'

export const skip = ['webkit']

export const test: Test = async ({ DragAndDrop, expect, Explorer, Locator, Workspace }) => {
  // arrange
  await Workspace.setPath('')
  const opfsRoot = await navigator.storage.getDirectory()
  const fileHandle = await opfsRoot.getFileHandle('dropped-file.txt', {
    create: true,
  })
  const file = await fileHandle.getFile()
  const dropId = await DragAndDrop.createDropSession([{ file, fileSystemHandle: fileHandle, kind: 'file', type: file.type }])
  const welcomeMessage = Locator('.Explorer .WelcomeMessage')
  const treeItems = Locator('.TreeItem')

  // act
  await Explorer.handleDrop(5000, 5000, dropId)

  // assert
  await expect(welcomeMessage).toBeVisible()
  await expect(welcomeMessage).toHaveText('You have not yet opened a folder.')
  await expect(treeItems).toHaveCount(0)
}
