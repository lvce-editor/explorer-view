import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-accessibility-rename-updates-aria'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.focusIndex(1)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('b.txt')
  await Explorer.acceptEdit()

  // assert
  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  const c = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(a).toHaveAttribute('aria-posinset', '1')
  await expect(a).toHaveAttribute('aria-setsize', '2')
  await expect(b).toHaveAttribute('aria-level', '1')
  await expect(b).toHaveAttribute('aria-posinset', '2')
  await expect(b).toHaveAttribute('aria-setsize', '2')
  await expect(b).toHaveId('TreeItemActive')
  await expect(c).toBeHidden()
}
