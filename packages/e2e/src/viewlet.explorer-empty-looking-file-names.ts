import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-empty-looking-file-names'

const fileNames = [
  '\u180E', // Mongolian vowel separator
  '\u200B', // zero-width space
  '\u200C', // zero-width non-joiner
  ' ',
  '\u00A0', // non-breaking space
]

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
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
    const fileName = fileNames[i]
    const treeItem = treeItems.nth(i)
    const label = treeItem.locator('.Label')
    await expect(treeItem).toHaveAttribute('aria-label', fileName)
    await expect(treeItem).toHaveAttribute('title', `${tmpDir}/${fileName}`)
    await expect(label).toHaveText(fileName)
  }
}
