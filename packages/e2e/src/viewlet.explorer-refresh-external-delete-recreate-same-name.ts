import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-delete-recreate-same-name'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'before')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await FileSystem.remove(`${tmpDir}/file.txt`)
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'after')
  await Explorer.refresh()

  // assert
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(file).toBeVisible()
  await expect(file).toHaveId('TreeItemActive')
}
