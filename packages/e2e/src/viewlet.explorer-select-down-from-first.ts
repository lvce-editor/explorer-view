import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-down-from-first'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  await Explorer.selectDown()

  const firstFile = Locator('.TreeItem[aria-label="a.txt"]')
  const secondFile = Locator('.TreeItem[aria-label="b.txt"]')
  const lastFile = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(firstFile).toHaveClass('TreeItemActive')
  await expect(secondFile).toHaveClass('TreeItemActive')
  await expect(secondFile).toHaveId('TreeItemActive')
  await expect(lastFile).not.toHaveClass('TreeItemActive')
}
