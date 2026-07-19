import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-left-nested-file-focuses-parent'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()
  await Explorer.focusIndex(1)

  // act
  await Command.execute('Explorer.handleArrowLeft')

  // assert
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(folder).toHaveId('TreeItemActive')
  await expect(file).toBeVisible()
}
