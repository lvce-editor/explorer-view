import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-accept-rename-refresh'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'a')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'b')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)
  await Command.execute('Explorer.renameDirent')
  await Command.execute('Explorer.updateEditingValue', 'renamed.txt')

  // act: acceptEdit renames the file while refresh concurrently reads the old directory state
  await Promise.all([Command.execute('Explorer.acceptEdit'), Command.execute('Explorer.refresh')])

  // assert: the accepted name is present on disk and represented once in the tree
  await FileSystem.shouldHaveFile(`${tmpDir}/renamed.txt`, 'a')
  const renamed = Locator('.TreeItem[aria-label="renamed.txt"]')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  const inputs = Locator('.Explorer input')
  await expect(renamed).toHaveCount(1)
  await expect(renamed).toBeVisible()
  await expect(b).toBeVisible()
  await expect(inputs).toBeHidden()

  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
}
