import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sort-case-insensitive'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/README.md` },
    { content: '', uri: `${tmpDir}/package.json` },
    { content: '', uri: `${tmpDir}/LICENSE` },
    { content: '', uri: `${tmpDir}/eslint.config.js` },
    { content: '', uri: `${tmpDir}/package-lock.json` },
  ])
  await FileSystem.mkdir(`${tmpDir}/Zebra`)
  await FileSystem.mkdir(`${tmpDir}/packages`)

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(7)
  const firstTreeItem = treeItems.nth(0)
  const secondTreeItem = treeItems.nth(1)
  const thirdTreeItem = treeItems.nth(2)
  const fourthTreeItem = treeItems.nth(3)
  const fifthTreeItem = treeItems.nth(4)
  const sixthTreeItem = treeItems.nth(5)
  const seventhTreeItem = treeItems.nth(6)
  await expect(firstTreeItem).toHaveText('packages')
  await expect(secondTreeItem).toHaveText('Zebra')
  await expect(thirdTreeItem).toHaveText('eslint.config.js')
  await expect(fourthTreeItem).toHaveText('LICENSE')
  await expect(fifthTreeItem).toHaveText('package-lock.json')
  await expect(sixthTreeItem).toHaveText('package.json')
  await expect(seventhTreeItem).toHaveText('README.md')
}
