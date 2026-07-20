import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-file-switch-folders'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.mkdir(`${tmpDir}/b`)
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act: focus folder a then folder b, then fire two concurrent newFile calls
  await Command.execute('Explorer.focusIndex', 0)
  await Command.execute('Explorer.focusIndex', 1)
  await Promise.all([Command.execute('Explorer.newFile'), Command.execute('Explorer.newFile')])

  // assert: only one input should be visible — both calls should not produce two inputs
  const inputBoxes = Locator('input')
  await expect(inputBoxes).toHaveCount(1)
}
