import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-symlink-broken-displays-error'

export const skip = 1

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Command.execute('FileSystem.symlink', `${tmpDir}/missing.txt`, `${tmpDir}/broken.txt`)
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusFirst()
  await Explorer.clickCurrent()

  // assert
  const broken = Locator('.TreeItem[aria-label="broken.txt"]')
  const error = Locator('.Explorer .ErrorMessage')
  await expect(broken).toBeVisible()
  await expect(error).toBeVisible()
}
