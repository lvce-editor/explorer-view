import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-inside-closed-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder1`)
  await FileSystem.writeFile(`${tmpDir}/folder1/existing.txt`, 'content')
  await FileSystem.mkdir(`${tmpDir}/folder2`)
  await FileSystem.mkdir(`${tmpDir}/folder2/nested`)
  await FileSystem.writeFile(`${tmpDir}/folder2/nested/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)

  // act
  await Explorer.newFile()

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await Explorer.updateEditingValue('created.txt')
  await Explorer.acceptEdit()

  // assert
  const newFile = Locator('text=created.txt')
  await expect(newFile).toBeVisible()
  const closedFolder = Locator('text=folder2')
  await expect(closedFolder).toBeVisible()
}
