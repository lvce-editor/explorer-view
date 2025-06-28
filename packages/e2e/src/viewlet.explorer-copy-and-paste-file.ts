import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-and-paste-file'

export const test: Test = async ({ FileSystem, Workspace, Explorer, expect, Locator, Command }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  // act
  await Command.execute('Explorer.handleCut')
  await Explorer.focusIndex(2)
  await Command.execute('Explorer.handlePaste')

  // assert
  const file1 = Locator('.TreeItem').nth(0)
  await expect(file1).toHaveText('a')
  await expect(file1).toHaveAttribute('aria-expanded', 'true')
  const file2 = Locator('.TreeItem').nth(1)
  await expect(file2).toHaveText('file.txt')
  const file3 = Locator('.TreeItem').nth(2)
  await expect(file3).toHaveText('b')
  await expect(file3).toHaveAttribute('aria-expanded', 'false') // TODO should be true
  const file4 = Locator('.TreeItem').nth(3)
  await expect(file4).toHaveText('file.txt')
}
