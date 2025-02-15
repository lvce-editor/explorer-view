import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sorting'

export const test: Test = async ({ FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/1.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/2.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/3.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/4.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/5.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/6.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/7.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/8.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/9.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/10.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // assert
  const items = Locator('.TreeItem')
  await expect(items).toHaveCount(10)
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
  await expect(itemOne).toHaveText('1.txt')
  await expect(itemTwo).toHaveText('2.txt')
  await expect(itemThree).toHaveText('3.txt')
  await expect(itemFour).toHaveText('4.txt')
  await expect(itemFive).toHaveText('5.txt')
  await expect(itemSix).toHaveText('6.txt')
  await expect(itemSeven).toHaveText('7.txt')
  await expect(itemEight).toHaveText('8.txt')
  await expect(itemNine).toHaveText('9.txt')
  await expect(itemTen).toHaveText('10.txt')
}
