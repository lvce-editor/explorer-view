import { type Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-multiple-files-individually'

export const test: Test = async ({ Explorer, FileSystem, Workspace, Locator, expect, Command }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  // act
  await Command.execute('Explorer.toggleIndividualSelection', 1)
  await Command.execute('Explorer.toggleIndividualSelection', 2)

  // assert
  const file1 = Locator('.TreeItem').nth(0)
  await expect(file1).toHaveClass('TreeItem')
  const file2 = Locator('.TreeItem').nth(1)
  await expect(file2).toHaveClass('TreeItemActive')
  const file3 = Locator('.TreeItem').nth(2)
  await expect(file3).not.toHaveClass('TreeItemActive')
}
