import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sort-numeric-file-names'

export const skip = 1

export const test: Test = async ({ FileSystem, Workspace, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/file-1.txt`)
  await FileSystem.mkdir(`${tmpDir}/file-10.txt`)
  await FileSystem.mkdir(`${tmpDir}/file-2.txt`)

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(1)
  await expect(treeItems.nth(0)).toHaveText('a')
}
