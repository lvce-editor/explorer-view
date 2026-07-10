import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-shift-select-while-renaming'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  await Explorer.renameDirent()

  await Explorer.handleClickAt(false, 0, false, true, 300, 105)

  const input = Locator('.Explorer input')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  const c = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(input).toBeVisible()
  await expect(b).toHaveClass('TreeItemActive')
  await expect(c).toHaveClass('TreeItemActive')
}
