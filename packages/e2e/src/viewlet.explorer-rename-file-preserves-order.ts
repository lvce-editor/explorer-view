import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-preserves-order'

export const skip = ['webkit']

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const assertOrder = async (expected: readonly string[]): Promise<void> => {
    const treeItems = Locator('.TreeItem')
    for (let i = 0; i < expected.length; i++) {
      const treeItem = treeItems.nth(i)
      await expect(treeItem).toHaveText(expected[i])
    }
    await expect(treeItems).toHaveCount(expected.length)
  }

  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/.nvmrc` },
    { content: '', uri: `${tmpDir}/LICENSE` },
    { content: '', uri: `${tmpDir}/README.md` },
    { content: '', uri: `${tmpDir}/eslint.config.js` },
    { content: '', uri: `${tmpDir}/package.json` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.refresh()

  const initialOrder = ['.nvmrc', 'LICENSE', 'README.md', 'eslint.config.js', 'package.json']
  const renamedOrder = ['.nvmrc', 'LICENSE', 'eslint.config.js', 'package.json', 'readme2.md']
  await assertOrder(initialOrder)

  // act
  await Explorer.focusIndex(2)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('readme2.md')
  await Explorer.acceptEdit()

  // assert
  await assertOrder(renamedOrder)

  // act
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('README.md')
  await Explorer.acceptEdit()

  // assert
  await assertOrder(initialOrder)
}
