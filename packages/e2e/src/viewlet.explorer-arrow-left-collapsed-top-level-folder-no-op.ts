import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-left-collapsed-top-level-folder-no-op'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  await Explorer.handleArrowLeft()

  const folder = Locator('.TreeItem[aria-label="folder"]')
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(folder).toHaveId('TreeItemActive')
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(file).toBeHidden()
}
