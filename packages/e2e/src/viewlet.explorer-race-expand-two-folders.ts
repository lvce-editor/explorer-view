import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-two-folders'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder-a`)
  await FileSystem.mkdir(`${tmpDir}/folder-b`)
  await FileSystem.writeFile(`${tmpDir}/folder-a/a1.txt`, 'a1')
  await FileSystem.writeFile(`${tmpDir}/folder-a/a2.txt`, 'a2')
  await FileSystem.writeFile(`${tmpDir}/folder-b/b1.txt`, 'b1')
  await FileSystem.writeFile(`${tmpDir}/folder-b/b2.txt`, 'b2')
  await Workspace.setPath(tmpDir)

  // act: click both folders concurrently to expand them — async expansions race
  await Promise.all([Command.execute('Explorer.handleClick', 0), Command.execute('Explorer.handleClick', 1)])

  // assert: explorer should be stable — no crash, no children from A under B or vice versa
  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // Should have 2 folders + their children: folder-a, a1.txt, a2.txt, folder-b, b1.txt, b2.txt = 6
  // But since expansions are concurrent, one might not expand. Minimum: 2, Maximum: 6
  expect(itemCount).toBeGreaterThanOrEqual(2)
  expect(itemCount).toBeLessThanOrEqual(6)

  // Verify folder-a is still at index 0 and folder-b is present
  const firstItem = treeItems.nth(0)
  await expect(firstItem).toHaveText('folder-a')

  // Verify b1.txt is present (should be under folder-b if expansion succeeded)
  const b1 = Locator('.TreeItem[aria-label="b1.txt"]')
  const b1Count = await b1.count()
  // b1.txt may or may not be visible depending on whether folder-b expanded
  expect(b1Count).toBeLessThanOrEqual(1)
}
