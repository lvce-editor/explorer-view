import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-ignored-file-decoration-invalid-null'

export const skip = 1

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.sourceControlDecorations': true,
  })
  const uri = import.meta.resolve('../fixtures/sample.source-control-decoration-invalid-null')
  await Extension.addWebExtension(uri)
  const tmpDir = 'extension-host://xyz://'
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a` },
    { content: '', uri: `${tmpDir}/b` },
    { content: 'a', uri: `${tmpDir}/.gitignore` },
  ])

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const a = Locator('.TreeItem[aria-label="a"]')
  await expect(a).toBeVisible()
}
