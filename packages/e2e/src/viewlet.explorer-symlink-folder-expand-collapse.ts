import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-symlink-folder-expand-collapse'

export const skip = 1

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/real-folder`)
  await FileSystem.writeFile(`${tmpDir}/real-folder/file.txt`, '')
  await Command.execute('FileSystem.symlink', `${tmpDir}/real-folder`, `${tmpDir}/linked-folder`)
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()

  // assert
  const linkedFolder = Locator('.TreeItem[aria-label="linked-folder"]')
  const child = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(linkedFolder).toHaveAttribute('aria-expanded', 'true')
  await expect(child).toBeVisible()

  // act
  await Explorer.clickCurrent()

  // assert
  await expect(linkedFolder).toHaveAttribute('aria-expanded', 'false')
  await expect(child).toBeHidden()
}
