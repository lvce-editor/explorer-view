import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-left-no-focus-no-op'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)

  // act
  await Command.execute('Explorer.handleArrowLeft')

  // assert
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  const activeItem = Locator('#TreeItemActive')
  await expect(file).toBeVisible()
  await expect(activeItem).toBeHidden()
}
