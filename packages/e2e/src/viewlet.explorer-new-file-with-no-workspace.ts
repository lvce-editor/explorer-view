import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-new-file-with-no-workspace'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const firstWorkspace = `${tmpDir}/first-workspace`
  const secondWorkspace = `${tmpDir}/second-workspace`
  await FileSystem.mkdir(firstWorkspace)
  await FileSystem.mkdir(secondWorkspace)
  await FileSystem.setFiles([
    { content: '', uri: `${firstWorkspace}/first.txt` },
    { content: '', uri: `${secondWorkspace}/second.txt` },
  ])
  await Workspace.setPath(firstWorkspace)
  await Workspace.setPath('')

  // act
  await Explorer.newFile()
  await Workspace.setPath(secondWorkspace)

  // assert
  const input = Locator('.Explorer input')
  const firstFile = Locator('.TreeItem[aria-label="first.txt"]')
  const secondFile = Locator('.TreeItem[aria-label="second.txt"]')
  await expect(input).toHaveCount(0)
  await expect(firstFile).toHaveCount(0)
  await expect(secondFile).toBeVisible()
}
