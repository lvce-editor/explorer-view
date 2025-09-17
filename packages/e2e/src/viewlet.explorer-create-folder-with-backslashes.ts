import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder-with-backslashes'

export const test: Test = async ({ FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')

  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFolder()

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.updateEditingValue('\\eee\\')
  await Explorer.acceptEdit()

  // assert - check if folder was created successfully
  // The folder name might be sanitized or the backslashes might be handled differently
  const newFolder = Locator('text=\\eee\\')
  await expect(newFolder).toBeVisible()

  // Also check if the folder was actually created in the file system
  // const folderExists = await FileSystem.exists(`${tmpDir}/\\eee\\`)
  // expect(folderExists).toBe(true)
}
