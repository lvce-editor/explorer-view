import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-previous-single-item-no-op'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/only.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  await Explorer.focusPrevious()

  const onlyFile = Locator('.TreeItem[aria-label="only.txt"]')
  const treeItems = Locator('.TreeItem')
  await expect(onlyFile).toHaveId('TreeItemActive')
  await expect(treeItems).toHaveCount(1)
}
