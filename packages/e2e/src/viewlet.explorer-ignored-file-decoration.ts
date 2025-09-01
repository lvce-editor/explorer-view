import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-ignored-file-decoration'

export const test: Test = async ({ FileSystem, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.mkdir(`${tmpDir}/b`)

  // act
  await Workspace.setPath(tmpDir)

  // assert
  // TODO add an ignore file that marks b as ignored
  // TODO verify that b is marked as ignored
}
