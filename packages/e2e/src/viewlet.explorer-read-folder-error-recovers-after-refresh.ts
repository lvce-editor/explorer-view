import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-read-folder-error-recovers-after-refresh'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await FileSystem.setProviderError(true)

  // act
  await Explorer.focusFirst()
  await Explorer.expandRecursively()

  // assert
  const error = Locator('.Explorer .ErrorMessage')
  await expect(error).toBeVisible()

  // act
  await FileSystem.setProviderError(false)
  await Explorer.refresh()
  await Explorer.expandRecursively()

  // assert
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(file).toBeVisible()
}
