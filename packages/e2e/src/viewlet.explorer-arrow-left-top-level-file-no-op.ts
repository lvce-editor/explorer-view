import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-left-top-level-file-no-op'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act
  await Command.execute('Explorer.handleArrowLeft')

  // assert
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(file).toHaveId('TreeItemActive')
}
