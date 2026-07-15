import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-source-control-decoration-after-external-refresh'

export const skip = 1

export const test: Test = async ({ expect, Explorer, Extension, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.sourceControlDecorations': true,
  })
  const uri = import.meta.resolve('../fixtures/sample.source-control-decoration')
  await Extension.addWebExtension(uri)
  const tmpDir = 'extension-host://xyz://'
  await FileSystem.writeFile(`${tmpDir}/a`, '')
  await FileSystem.writeFile(`${tmpDir}/b`, '')
  await Workspace.setPath(tmpDir)
  const decorated = Locator('.TreeItem[aria-label="a"]')
  const plain = Locator('.TreeItem[aria-label="b"]')
  await expect(decorated).toHaveClass('decoration-ignored')
  await expect(plain).toBeVisible()

  // act
  await FileSystem.writeFile(`${tmpDir}/c`, '')
  await Explorer.refresh()

  // assert
  const newPlain = Locator('.TreeItem[aria-label="c"]')
  await expect(decorated).toHaveClass('decoration-ignored')
  await expect(newPlain).toBeVisible()
  await expect(plain).toBeVisible()
}
