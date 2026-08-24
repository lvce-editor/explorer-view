import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-first-from-last'

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
  await Explorer.focusFirst()

  // assert
  const firstFile = Locator('.TreeItem[aria-label="a.txt"]')
  await expect(firstFile).toHaveId('TreeItemActive')
}
