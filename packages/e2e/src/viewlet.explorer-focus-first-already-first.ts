import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-first-already-first'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  await Explorer.focusFirst()

  const firstFile = Locator('.TreeItem[aria-label="a.txt"]')
  const activeItems = Locator('#TreeItemActive')
  await expect(firstFile).toHaveId('TreeItemActive')
  await expect(activeItems).toHaveCount(1)
}
