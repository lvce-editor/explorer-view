import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-folder-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, 'a')
  await FileSystem.writeFile(`${tmpDir}/folder/b.txt`, 'b')
  await FileSystem.writeFile(`${tmpDir}/folder/c.txt`, 'c')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)

  // act: click folder to expand (async reads children), refresh rebuilds tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleClick', 0), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no duplicate children
  // folder and root.txt should always be visible
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(folder).toBeVisible()
  await expect(rootFile).toBeVisible()

  // At most 5 items (folder + 3 children + root.txt)
  const treeItems = Locator('.TreeItem')
  const sixthItem = treeItems.nth(5)
  await expect(sixthItem).toBeHidden()
}
