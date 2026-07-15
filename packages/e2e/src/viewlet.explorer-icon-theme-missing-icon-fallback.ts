import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-icon-theme-missing-icon-fallback'

export const skip = 1

export const test: Test = async ({ expect, Extension, FileSystem, IconTheme, Locator, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/sample.icon-theme')
  await Extension.addWebExtension(extensionUri)
  await IconTheme.setIconTheme('test-icon-theme')
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/unknown.ext`, '')
  await FileSystem.mkdir(`${tmpDir}/folder`)

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const file = Locator('.TreeItem[aria-label="unknown.ext"]')
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const fileIcon = file.locator('.FileIcon')
  await expect(file).toBeVisible()
  await expect(folder).toBeVisible()
  await expect(fileIcon).toBeVisible()
}
