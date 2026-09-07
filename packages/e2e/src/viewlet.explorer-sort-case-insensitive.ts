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
  await expect(treeItems.nth(0)).toHaveText('packages')
  await expect(treeItems.nth(1)).toHaveText('Zebra')
  await expect(treeItems.nth(2)).toHaveText('eslint.config.js')
  await expect(treeItems.nth(3)).toHaveText('LICENSE')
  await expect(treeItems.nth(4)).toHaveText('package-lock.json')
  await expect(treeItems.nth(5)).toHaveText('package.json')
  await expect(treeItems.nth(6)).toHaveText('README.md')
}
