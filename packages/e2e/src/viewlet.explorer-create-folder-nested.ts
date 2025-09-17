import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder-nested'

export const test: Test = async ({ FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')

  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFolder()

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.updateEditingValue('a/b/c')
  await Explorer.acceptEdit()

  // assert
  const file1 = Locator('.TreeItem').nth(0)
  await expect(file1).toHaveText('a')
  await expect(file1).toHaveAttribute('aria-expanded', 'true')
  const file2 = Locator('.TreeItem').nth(1)
  await expect(file2).toHaveText('b')
  await expect(file2).toHaveAttribute('aria-expanded', 'true')
  const file3 = Locator('.TreeItem').nth(2)
  await expect(file3).toHaveText('c')
  await expect(file3).toHaveAttribute('aria-expanded', 'false')
  const file4 = Locator('.TreeItem').nth(3)
  await expect(file4).toHaveText('file1.txt')
}
