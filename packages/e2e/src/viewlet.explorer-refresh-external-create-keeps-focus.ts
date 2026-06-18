import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-create-keeps-focus'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  const focusedFile = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(focusedFile).toHaveId('TreeItemActive')

  // act
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Explorer.refresh()

  // assert
  const newFile = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(newFile).toBeVisible()
  await expect(focusedFile).toHaveId('TreeItemActive')
}
