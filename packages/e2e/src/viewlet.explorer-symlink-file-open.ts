import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-symlink-file-open'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/target.txt`, 'target content')
  await FileSystem.symlink(`${tmpDir}/target.txt`, `${tmpDir}/link.txt`)
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('target content')
}
