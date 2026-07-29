import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-collapse-all-flat-files-focuses-first'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusLast()

  await Explorer.collapseAll()

  const firstFile = Locator('.TreeItem[aria-label="a.txt"]')
  const treeItems = Locator('.TreeItem')
  await expect(firstFile).toHaveId('TreeItemActive')
  await expect(treeItems).toHaveCount(3)
}
