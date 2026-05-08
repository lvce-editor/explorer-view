import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-expand-folder-100k-items'

export const test: Test = async ({ expect, Explorer, Extension, Locator, Workspace }) => {
  // arrange
  const extensionUri = import.meta.resolve('../fixtures/sample.file-system-provider-expand-folder-100k-items')
  await Extension.addWebExtension(extensionUri)
  const workspacePath = 'extension-host://xyz://'
  await Workspace.setPath(workspacePath)

  // act
  await Explorer.focusFirst()
  const folder = Locator('.TreeItem', { hasText: 'stress-folder' })
  await expect(folder).toHaveId('TreeItemActive')
  await Explorer.clickCurrent()

  // assert
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  const firstItem = Locator('.TreeItem', { hasText: 'item-000000.txt' })
  const lastItem = Locator('.TreeItem', { hasText: 'item-099999.txt' })
  await expect(firstItem).toBeVisible()
  await Explorer.focusIndex(100_000)
  await expect(lastItem).toBeVisible()
  await expect(lastItem).toHaveId('TreeItemActive')
}
