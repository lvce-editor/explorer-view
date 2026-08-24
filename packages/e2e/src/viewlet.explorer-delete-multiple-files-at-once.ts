import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-multiple-files'

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  const explorer = Locator('.Explorer')
  const file1 = explorer.locator('text=file1.txt')
  const file2 = explorer.locator('text=file2.txt')
  const file3 = explorer.locator('text=file3.txt')
  await Explorer.focus()
  await Explorer.selectIndices([0, 1])

  // act
  await Explorer.removeDirent()

  // assert
  await expect(file1).toBeHidden()
  await expect(file2).toBeHidden()
  await expect(file3).toBeVisible()

  // TODO file3 should be focused
}
