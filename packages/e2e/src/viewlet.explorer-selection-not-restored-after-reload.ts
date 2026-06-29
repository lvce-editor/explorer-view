import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-selection-not-restored-after-reload'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.selectIndices([0, 1])

  // act
  await Workspace.setPath('')
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  const activeItems = Locator('.TreeItemActive')
  await expect(treeItems).toHaveCount(3)
  await expect(activeItems).toHaveCount(0)
}
