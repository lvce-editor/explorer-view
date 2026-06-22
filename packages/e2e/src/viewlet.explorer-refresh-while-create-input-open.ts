import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-while-create-input-open'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.newFile()
  await Explorer.updateEditingValue('draft.txt')

  // act
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await Explorer.refresh()

  // assert
  const input = Locator('input')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(input).toBeHidden()
  await expect(b).toBeVisible()
}
