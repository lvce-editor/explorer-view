import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-down-at-last'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  await Explorer.selectDown()

  const lastFile = Locator('.TreeItem[aria-label="c.txt"]')
  const treeItems = Locator('.TreeItem')
  await expect(lastFile).toHaveId('TreeItemActive')
  await expect(treeItems).toHaveCount(3)
}
