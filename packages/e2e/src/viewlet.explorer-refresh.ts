import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // act
  await FileSystem.remove(`${tmpDir}/file1.txt`)
  await Explorer.refresh()

  // assert
  await expect(file1).toBeHidden()
}
