import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-save-state-expand'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/f1.txt`, 'f1')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)

  // act: saveState saves scroll/expand state, handleClick expands folder — both fire concurrently
  await Promise.all([Explorer.saveState(), Explorer.handleClick(0)])

  // assert: explorer should be stable — no crash, no stale state
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
