import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-preserves-order'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()

  const assertOrder = async (expected: readonly string[]): Promise<void> => {
    try {
      const treeItems = Locator('.TreeItem')
      await expect(treeItems).toHaveCount(expected.length)
      for (let i = 0; i < expected.length; i++) {
        const treeItem = treeItems.nth(i)
        await expect(treeItem).toHaveText(expected[i])
      }
    } catch (error) {
      const [explorerState, fileSystemDirents] = await Promise.all([
        Command.execute('Explorer.getDebugState'),
        FileSystem.readDir(tmpDir),
      ])
      throw new Error(
        `[flaky-e2e-debug] rename order mismatch: ${JSON.stringify({
          explorerState,
          expected,
          fileSystemDirents,
        })}`,
        { cause: error },
      )
    }
  }

  // arrange
  await FileSystem.writeFile(`${tmpDir}/.nvmrc`, '')
  await FileSystem.writeFile(`${tmpDir}/LICENSE`, '')
  await FileSystem.writeFile(`${tmpDir}/README.md`, '')
  await FileSystem.writeFile(`${tmpDir}/eslint.config.js`, '')
  await FileSystem.writeFile(`${tmpDir}/package.json`, '')
  await Workspace.setPath(tmpDir)

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
