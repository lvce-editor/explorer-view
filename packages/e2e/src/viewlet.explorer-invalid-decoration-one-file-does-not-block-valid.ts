import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-invalid-decoration-one-file-does-not-block-valid'

export const skip = 1

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.sourceControlDecorations': true,
  })
  const uri = import.meta.resolve('../fixtures/sample.source-control-decoration-invalid-object')
  await Extension.addWebExtension(uri)
  const tmpDir = 'extension-host://xyz://'
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a` },
    { content: '', uri: `${tmpDir}/b` },
    { content: 'b', uri: `${tmpDir}/.gitignore` },
  ])

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const a = Locator('.TreeItem[aria-label="a"]')
  const b = Locator('.TreeItem[aria-label="b"]')
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()
  await expect(b).toHaveClass('decoration-ignored')
}
