import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-zero-width-file-names'

const fileNames = ['a\u{200B}b.txt', 'a\u{200C}b.txt', 'a\u{200D}b.txt']

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  for (const fileName of fileNames) {
    await FileSystem.writeFile(`${tmpDir}/${fileName}`, '')
  }

  // act
  await Workspace.setUri(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(fileNames.length)
  for (const [i, fileName] of fileNames.entries()) {
    const treeItem = treeItems.nth(i)
    await Explorer.focusIndex(i)
    await expect(treeItem).toHaveAttribute('aria-label', fileName)
    await expect(treeItem).toHaveId('TreeItemActive')
  }
}
