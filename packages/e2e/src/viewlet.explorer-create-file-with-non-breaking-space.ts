import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-with-non-breaking-space'

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
  await Explorer.newFile()

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  const fileName = 'my\u{A0}file.txt'
  await Explorer.updateEditingValue(fileName)
  await Explorer.acceptEdit()

  // assert
  const dirents = await FileSystem.readDir(tmpDir)
  const hasCreatedFile = dirents.some((dirent) => dirent.name === fileName)
  if (!hasCreatedFile) {
    throw new Error(`Expected directory to contain ${JSON.stringify(fileName)} but got ${JSON.stringify(dirents)}`)
  }
}
