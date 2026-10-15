import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-source-control-decoration'

export const test: Test = async ({ expect, Extension, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.sourceControlDecorations': true,
  })
  const uri = import.meta.resolve('../fixtures/sample.source-control-decoration')
  await Extension.addWebExtension(uri)
  const tmpDir = 'extension-host://xyz://'
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a` },
    { content: '', uri: `${tmpDir}/b` },
  ])
  await Workspace.setUri(tmpDir)

  // assert
  const decorated = Locator('.TreeItem[aria-label="a"]')
  const plain = Locator('.TreeItem[aria-label="b"]')
  await expect(decorated).toHaveClass('decoration-ignored')
  await expect(plain).toBeVisible()
}
