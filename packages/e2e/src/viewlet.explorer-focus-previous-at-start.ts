import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-previous-at-start'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act
  await Command.execute('Explorer.focusPrevious')

  // assert
  const firstFile = Locator('.TreeItem[aria-label="a.txt"]')
  await expect(firstFile).toHaveId('TreeItemActive')
}
