import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-cancel'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(1)
  await Explorer.renameDirent()

  // assert
  const explorer = Locator('.Explorer')
  const inputBox = explorer.locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.cancelEdit()

  // assert
  await expect(inputBox).toBeHidden()

  const file2 = Locator('.TreeItem', { hasText: 'file2.txt' })
  await expect(file2).toBeVisible()

  // TODO
  // await expect(explorer).toBeFocused()
  await expect(file2).toHaveId('TreeItemActive')
}
