import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-open-containing-folder-after-rename'

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder/nested`)
  await FileSystem.writeFile(`${tmpDir}/folder/nested/file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(2)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('renamed.txt')
  await Explorer.acceptEdit()

  // act
  await Explorer.openContextMenu(2)
  await ContextMenu.selectItem('Open Containing Folder')

  // assert
  const containingFolder = Locator('.TreeItem[aria-label="nested"]')
  const renamed = Locator('.TreeItem[aria-label="renamed.txt"]')
  await expect(containingFolder).toBeVisible()
  await expect(containingFolder).toHaveAttribute('aria-expanded', 'true')
  await expect(renamed).toBeVisible()
}
