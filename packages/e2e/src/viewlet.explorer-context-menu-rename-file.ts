import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-rename-file'

export const skip = ['webkit']

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.openContextMenu(1)
  await ContextMenu.selectItem('Rename')

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.updateEditingValue('renamed.txt')
  await Explorer.acceptEdit()

  // assert
  const renamedFile = Locator('.TreeItem[aria-label="renamed.txt"]')
  await expect(renamedFile).toBeVisible()
}
