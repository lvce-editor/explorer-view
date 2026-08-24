import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-open-containing-folder-nested-file'

export const skip = 1

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder/nested`)
  await FileSystem.setFiles([
    { content: 'content', uri: `${tmpDir}/folder/nested/file.txt` },
    { content: 'content', uri: `${tmpDir}/root.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(2)

  // act
  await Explorer.openContextMenu(2)
  await ContextMenu.selectItem('Open Containing Folder')

  // assert
  const containingFolder = Locator('.TreeItem[aria-label="nested"]')
  const nestedFile = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(containingFolder).toBeVisible()
  await expect(containingFolder).toHaveId('TreeItemActive')
  await expect(containingFolder).toHaveAttribute('aria-expanded', 'true')
  await expect(nestedFile).toBeVisible()
}
