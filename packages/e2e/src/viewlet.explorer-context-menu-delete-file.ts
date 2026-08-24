import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-delete-file'

export const skip = ['webkit']

export const test: Test = async ({ ContextMenu, Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('Delete')

  // assert
  const file1 = Locator('text=file1.txt')
  await expect(file1).toBeHidden()
  const listItems = Locator('.Explorer .ListItems')
  await expect(listItems).toBeFocused()
}
