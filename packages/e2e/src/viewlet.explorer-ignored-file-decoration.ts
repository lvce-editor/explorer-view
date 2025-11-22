import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-ignored-file-decoration'

export const skip = 1

export const test: Test = async ({ FileSystem, Workspace, Extension, Settings }) => {
  // arrange
  await Settings.update({
    'explorer.sourceControlDecorations': true,
  })
  const uri = import.meta.resolve('../fixtures/sample.source-control-decoration')
  await Extension.addWebExtension(uri)
  const tmpDir = 'extension-host://xyz://'
  await FileSystem.writeFile(`${tmpDir}/a`, '')
  await FileSystem.writeFile(`${tmpDir}/b`, '')
  await FileSystem.writeFile(`${tmpDir}/.gitignore`, 'a')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  // TODO add an ignore file that marks b as ignored
  // TODO verify that b is marked as ignored
}
