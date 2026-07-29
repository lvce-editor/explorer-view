import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-last-already-last'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)

  await Explorer.focusLast()

  const lastFile = Locator('.TreeItem[aria-label="b.txt"]')
  const activeItems = Locator('#TreeItemActive')
  await expect(lastFile).toHaveId('TreeItemActive')
  await expect(activeItems).toHaveCount(1)
}
