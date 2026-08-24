import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-next-at-end'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)

  // act
  await Explorer.focusNext()

  // assert
  const lastFile = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(lastFile).toHaveId('TreeItemActive')
}
