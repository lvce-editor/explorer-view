import { type Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-up'

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
  await Command.execute('Explorer.selectUp')

  // assert
  const file1 = Locator('text=file1.txt')
  await expect(file1).toHaveClass('Selected')
  const file2 = Locator('text=file2.txt')
  await expect(file2).toHaveClass('Selected')
  const file3 = Locator('text=file3.txt')
  await expect(file3).not.toHaveClass('Selected')
}
