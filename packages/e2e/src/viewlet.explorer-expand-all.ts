import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-expand-all'

export const test: Test = async ({ FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder-1`)
  await FileSystem.mkdir(`${tmpDir}/folder-2`)
  await FileSystem.mkdir(`${tmpDir}/folder-3`)
  await FileSystem.writeFile(`${tmpDir}/folder-1/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-1/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-1/c.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-2/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-2/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-2/c.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-3/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-3/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder-3/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  // @ts-ignore
  await Explorer.expandAll()

  // assert
  const items = Locator('.TreeItem')
  await expect(items).toHaveCount(12)
  const itemOne = items.nth(0)
  const itemTwo = items.nth(1)
  const itemThree = items.nth(2)
  const itemFour = items.nth(3)
  const itemFive = items.nth(4)
  const itemSix = items.nth(5)
  const itemSeven = items.nth(6)
  const itemEight = items.nth(7)
  const itemNine = items.nth(8)
  const itemTen = items.nth(9)
  const itemEleven = items.nth(10)
  const itemTwelve = items.nth(11)
  await expect(itemOne).toHaveText('folder-1')
  await expect(itemTwo).toHaveText('a.txt')
  await expect(itemThree).toHaveText('b.txt')
  await expect(itemFour).toHaveText('c.txt')
  await expect(itemFive).toHaveText('folder-2')
  await expect(itemSix).toHaveText('a.txt')
  await expect(itemSeven).toHaveText('b.txt')
  await expect(itemEight).toHaveText('c.txt')
  await expect(itemNine).toHaveText('folder-3')
  await expect(itemTen).toHaveText('a.txt')
  await expect(itemEleven).toHaveText('b.txt')
  await expect(itemTwelve).toHaveText('c.txt')
}
