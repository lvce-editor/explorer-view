import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-collapse-parent-clears-hidden-child-selection'

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.selectIndices([1])
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const child = Locator('.TreeItem[aria-label="child.txt"]')
  await expect(child).toHaveClass('TreeItemActive')

  // act
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()
  await Explorer.removeDirent()

  // assert
  const root = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(folder).toBeHidden()
  await expect(child).toBeHidden()
  await expect(root).toBeVisible()
  await expect(root).toHaveId('TreeItemActive')
}
