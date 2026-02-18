import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sorting-mixed-alphanumeric-special'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/1file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/a-file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b_file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file@10.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file#2.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/file$3.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/z-file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/10file.txt`, '')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(10)
  await expect(treeItems.nth(0)).toHaveText('1file.txt')
  await expect(treeItems.nth(1)).toHaveText('10file.txt')
  await expect(treeItems.nth(2)).toHaveText('a-file.txt')
  await expect(treeItems.nth(3)).toHaveText('b_file.txt')
  await expect(treeItems.nth(4)).toHaveText('file@10.txt')
  await expect(treeItems.nth(5)).toHaveText('file#2.txt')
  await expect(treeItems.nth(6)).toHaveText('file$3.txt')
  await expect(treeItems.nth(7)).toHaveText('file1.txt')
  await expect(treeItems.nth(8)).toHaveText('file2.txt')
  await expect(treeItems.nth(9)).toHaveText('z-file.txt')
}
