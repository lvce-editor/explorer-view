import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sorting-special-characters'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/-file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/!file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/(file).txt`, '')
  await FileSystem.writeFile(`${tmpDir}/[file].txt`, '')
  await FileSystem.writeFile(`${tmpDir}/{file}.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/@file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/&file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/#file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/+file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/$file.txt`, '')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(10)
  await expect(treeItems.nth(0)).toHaveText('-file.txt')
  await expect(treeItems.nth(1)).toHaveText('!file.txt')
  await expect(treeItems.nth(2)).toHaveText('(file).txt')
  await expect(treeItems.nth(3)).toHaveText('[file].txt')
  await expect(treeItems.nth(4)).toHaveText('{file}.txt')
  await expect(treeItems.nth(5)).toHaveText('@file.txt')
  await expect(treeItems.nth(6)).toHaveText('&file.txt')
  await expect(treeItems.nth(7)).toHaveText('#file.txt')
  await expect(treeItems.nth(8)).toHaveText('+file.txt')
  await expect(treeItems.nth(9)).toHaveText('$file.txt')
}
