import { type Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh'

export const test: Test = async ({ Command, FileSystem, Workspace, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const file1 = Locator('.TreeItem', { hasText: 'file1.txt' })
  await expect(file1).toBeVisible()

  // act
  await Command.execute('FileSystem.remove', `${tmpDir}/file1.txt`)
  await Command.execute('Explorer.refresh')

  // assert
  // await expect(file1).toHaveCount(0)
}
