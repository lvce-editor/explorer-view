import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-open-containing-folder-unsupported-scheme'

export const test: Test = async ({ expect, Explorer, Locator, Workspace }) => {
  // arrange
  await Workspace.setPath('remote-ssh://user@example.com/home/test/workspace')
  await Explorer.focusIndex(-1)

  // act
  await Explorer.openContextMenu(-1)

  // assert
  const openContainingFolder = Locator('.MenuItem:has-text("Open Containing Folder")')
  await expect(openContainingFolder).toBeVisible()
  await expect(openContainingFolder).toHaveAttribute('aria-disabled', 'true')
}
