import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-up-from-last'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  await Explorer.selectUp()

  const firstFile = Locator('.TreeItem[aria-label="a.txt"]')
  const secondFile = Locator('.TreeItem[aria-label="b.txt"]')
  const lastFile = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(firstFile).toHaveClass('TreeItem')
  await expect(secondFile).toHaveClass('TreeItemActive')
  await expect(lastFile).toHaveClass('TreeItemActive')
  await expect(lastFile).toHaveId('TreeItemActive')
}
