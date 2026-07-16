import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-open-file-keeps-editor-stable'

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/open.txt`, 'content')
  await FileSystem.writeFile(`${tmpDir}/other.txt`, 'other')
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
  await expect(tab).toBeVisible()
}
