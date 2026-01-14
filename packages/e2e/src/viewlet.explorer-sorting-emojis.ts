import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sorting-emojis'

export const skip = 1

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/🚀 rocket.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/🌟 star.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/💎 diamond.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/🔥 fire.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/⚡ lightning.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/🌈 rainbow.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/🎯 target.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/💡 idea.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/🚀🚀 double-rocket.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/a-normal-file.txt`, '')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(10)
  await expect(treeItems.nth(0)).toHaveText('⚡ lightning.txt')
  await expect(treeItems.nth(1)).toHaveText('🌈 rainbow.txt')
  await expect(treeItems.nth(2)).toHaveText('⭐ star.txt')
  await expect(treeItems.nth(3)).toHaveText('🎯 target.txt')
  await expect(treeItems.nth(4)).toHaveText('💎 diamond.txt')
  await expect(treeItems.nth(5)).toHaveText('💡 idea.txt')
  await expect(treeItems.nth(6)).toHaveText('🔥 fire.txt')
  await expect(treeItems.nth(7)).toHaveText('🚀 rocket.txt')
  await expect(treeItems.nth(8)).toHaveText('🚀🚀 double-rocket.txt')
  await expect(treeItems.nth(9)).toHaveText('a-normal-file.txt')
}
