import { type Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-multiple-files-with-mouse'

export const skip = 1

export const test: Test = async ({ Command, Explorer, FileSystem, Workspace, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  // act
  await Command.execute('Explorer.handleClickAt', 0, false, true, 300, 300)

  // assert
  const file1 = Locator('text=file1.txt')
  await expect(file1).toHaveClass('TreeItemActive')
  const file2 = Locator('text=file1.txt')
  await expect(file2).toHaveClass('TreeItemActive')
  const file3 = Locator('text=file1.txt')
  await expect(file3).not.toHaveClass('TreeItemActive')
}
