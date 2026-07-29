import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-keyboard-context-menu-multi-selection'

export const test: Test = async ({ ContextMenu, Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.selectIndices([0, 1])

  // act
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('Delete')

  // assert
  const fileA = Locator('.TreeItem[aria-label="a.txt"]')
  const fileB = Locator('.TreeItem[aria-label="b.txt"]')
  const fileC = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(fileA).toBeHidden()
  await expect(fileB).toBeHidden()
  await expect(fileC).toBeVisible()
}
