import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-error-message-clears-after-successful-operation'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/existing.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.newFile()
  await Explorer.updateEditingValue('existing.txt')
  const errorMessage = Locator('.ExplorerErrorMessage')
  await expect(errorMessage).toBeVisible()

  // act
  await Explorer.updateEditingValue('created.txt')
  await Explorer.acceptEdit()

  // assert
  const created = Locator('.TreeItem[aria-label="created.txt"]')
  await expect(created).toBeVisible()
  await expect(errorMessage).toBeHidden()
}
