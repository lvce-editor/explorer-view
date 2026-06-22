import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-delete-focused-item'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  const deletedFile = Locator('.TreeItem[aria-label="b.txt"]')
  const nextFile = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(deletedFile).toHaveId('TreeItemActive')

  // act
  await FileSystem.remove(`${tmpDir}/b.txt`)
  await Explorer.refresh()

  // assert
  await expect(deletedFile).toBeHidden()
  await expect(nextFile).toBeVisible()
  await expect(nextFile).toHaveId('TreeItemActive')
}
