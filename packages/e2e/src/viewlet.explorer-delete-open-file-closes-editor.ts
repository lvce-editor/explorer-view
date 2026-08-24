import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-open-file-closes-editor'

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content', uri: `${tmpDir}/open.txt` },
    { content: 'other', uri: `${tmpDir}/other.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()
  const tab = Locator('[title*="open.txt"]').first()
  await expect(tab).toBeVisible()
  await Explorer.focusIndex(0)

  // act
  await Explorer.removeDirent()

  // assert
  const deleted = Locator('.TreeItem[aria-label="open.txt"]')
  const other = Locator('.TreeItem[aria-label="other.txt"]')
  await expect(deleted).toBeHidden()
  await expect(other).toBeVisible()
  await expect(tab).toBeHidden()
}
