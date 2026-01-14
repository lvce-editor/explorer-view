import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sorting-unicode-characters'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/café.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/naïve.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/résumé.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/piñata.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/jalapeño.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/façade.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/séance.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/déjà.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/château.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/soirée.txt`, '')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(10)
  await expect(treeItems.nth(0)).toHaveText('café.txt')
  await expect(treeItems.nth(1)).toHaveText('château.txt')
  await expect(treeItems.nth(2)).toHaveText('déjà.txt')
  await expect(treeItems.nth(3)).toHaveText('façade.txt')
  await expect(treeItems.nth(4)).toHaveText('jalapeño.txt')
  await expect(treeItems.nth(5)).toHaveText('naïve.txt')
  await expect(treeItems.nth(6)).toHaveText('piñata.txt')
  await expect(treeItems.nth(7)).toHaveText('résumé.txt')
  await expect(treeItems.nth(8)).toHaveText('séance.txt')
  await expect(treeItems.nth(9)).toHaveText('soirée.txt')
}
