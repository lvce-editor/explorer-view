import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-open-containing-folder-unsupported-scheme'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(-1)

  // act
  await Explorer.openContextMenu(-1)

  // assert
  const openContainingFolder = Locator('text=Open Containing Folder')
  await expect(openContainingFolder).toBeVisible()
  const disabledMenuItems = Locator('.MenuItem[aria-disabled="true"]')
  await expect(disabledMenuItems).toHaveCount(1)
  await expect(disabledMenuItems).toContainText('Open Containing Folder')
}
