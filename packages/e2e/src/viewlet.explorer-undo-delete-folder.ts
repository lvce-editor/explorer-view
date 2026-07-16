import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-undo-delete-folder'

export const skip = 1

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/nested.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()
  await Explorer.expandAll()

  // act
  await Explorer.removeDirent()
  await (Explorer as typeof Explorer & { undo: () => Promise<void> }).undo()
  await Explorer.expandAll()

  // assert
  const folder = Locator('.TreeItem', { hasText: 'folder' })
  await expect(folder).toBeVisible()
  const nestedFile = Locator('.TreeItem', { hasText: 'nested.txt' })
  await expect(nestedFile).toBeVisible()
}
