import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-left-deep-file-focuses-immediate-parent'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/parent/child`)
  await FileSystem.writeFile(`${tmpDir}/parent/child/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusLast()

  await Explorer.handleArrowLeft()

  const child = Locator('.TreeItem[aria-label="child"]')
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(child).toHaveId('TreeItemActive')
  await expect(file).toBeVisible()
}
