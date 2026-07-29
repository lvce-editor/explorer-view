import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-left-collapsed-nested-folder-focuses-parent'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/parent/child`)
  await FileSystem.writeFile(`${tmpDir}/parent/child/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()
  await Explorer.focusIndex(1)

  // act
  await Explorer.handleArrowLeft()

  // assert
  const parent = Locator('.TreeItem[aria-label="parent"]')
  const child = Locator('.TreeItem[aria-label="child"]')
  await expect(parent).toHaveId('TreeItemActive')
  await expect(child).toHaveAttribute('aria-expanded', 'false')
}
