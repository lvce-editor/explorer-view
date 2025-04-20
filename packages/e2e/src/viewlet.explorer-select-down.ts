import { type Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-down'

export const skip = 1

export const test: Test = async ({ Explorer, Command, FileSystem, Workspace, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(1)
  await Command.execute('Explorer.selectDown')

  // assert
  const file1 = Locator('.TreeItem').nth(0)
  await expect(file1).toHaveClass('TreeItem')
  const file2 = Locator('.TreeItem').nth(1)
  await expect(file2).toHaveClass('TreeItemActive')
  const file3 = Locator('.TreeItem').nth(2)
  await expect(file3).not.toHaveClass('TreeItemActive')
}
