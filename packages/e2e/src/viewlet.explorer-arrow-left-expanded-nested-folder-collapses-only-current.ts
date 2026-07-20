import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-left-expanded-nested-folder-collapses-only-current'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/parent/child`)
  await FileSystem.writeFile(`${tmpDir}/parent/child/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  await Explorer.handleArrowLeft()

  const parent = Locator('.TreeItem[aria-label="parent"]')
  const child = Locator('.TreeItem[aria-label="child"]')
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(parent).toHaveAttribute('aria-expanded', 'true')
  await expect(child).toHaveAttribute('aria-expanded', 'false')
  await expect(child).toHaveId('TreeItemActive')
  await expect(file).toBeHidden()
}
