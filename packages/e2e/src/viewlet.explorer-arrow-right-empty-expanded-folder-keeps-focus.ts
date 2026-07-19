import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-right-empty-expanded-folder-keeps-focus'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()

  // act
  await Command.execute('Explorer.handleArrowRight')

  // assert
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const items = Locator('.TreeItem')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await expect(folder).toHaveId('TreeItemActive')
  await expect(items).toHaveCount(1)
}
