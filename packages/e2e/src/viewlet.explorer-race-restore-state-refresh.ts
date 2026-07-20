import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-restore-state-refresh'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/f1.txt`, 'f1')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.handleClick', 0)
  await Command.execute('Explorer.saveState')

  // act: restoreState restores saved expand/scroll state, refresh rebuilds the tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.restoreState'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no corrupt state
  // folder and root.txt should always be visible
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(folder).toBeVisible()
  await expect(rootFile).toBeVisible()

  // At most 3 tree items (folder + possibly f1.txt + root.txt)
  const treeItems = Locator('.TreeItem')
  const row3 = treeItems.nth(3)
  await expect(row3).toBeHidden()
}
