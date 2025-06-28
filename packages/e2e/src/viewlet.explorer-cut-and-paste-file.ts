import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-cut-and-paste-file'

export const skip = 1

export const test: Test = async ({ FileSystem, Workspace, Explorer, expect, Locator, Command }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  // act
  await Command.execute('Explorer.handleCut')
  await Explorer.focusIndex(2)
  await Command.execute('Explorer.handlePaste')

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()
}
