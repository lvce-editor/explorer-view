import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-zero-width-file-names'

const fileNames = [
  'a\u200Bb.txt',
  'a\u200Cb.txt',
  'a\u200Db.txt',
]

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  for (const fileName of fileNames) {
    await FileSystem.writeFile(`${tmpDir}/${fileName}`, '')
  }

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(fileNames.length)
  for (let i = 0; i < fileNames.length; i++) {
    const treeItem = treeItems.nth(i)
    await Explorer.focusIndex(i)
    await expect(treeItem).toHaveAttribute('aria-label', fileNames[i])
    await expect(treeItem).toHaveId('TreeItemActive')
  }
}
