import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file'

export const test: Test = async ({ Command, FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')

  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(1)
  await Explorer.renameDirent()

  // assert
  const explorer = Locator('.Explorer')
  const inputBox = explorer.locator('input')
  await expect(inputBox).toBeVisible()

  // TODO
  // await expect(inputBox).toBeFocused()

  // act
  await Explorer.updateEditingValue('file4.txt')
  await Explorer.acceptEdit()

  // assert
  await expect(inputBox).toBeHidden()

  const file4 = Locator('.TreeItem', { hasText: 'file4.txt' })
  await expect(file4).toBeVisible()

  // TODO
  // await expect(explorer).toBeFocused()
  await expect(file4).toHaveId('TreeItemActive')
}
