import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-refresh-button'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // act
  const refreshButton = Locator('button[name="Refresh"]')
  await refreshButton.click()

  // assert
  await expect(file1).toBeVisible()
}
