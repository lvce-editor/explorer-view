import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-right-nested-folder-expands'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/parent/child`)
  await FileSystem.writeFile(`${tmpDir}/parent/child/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Command.execute('Explorer.handleArrowRight')
  await Command.execute('Explorer.handleArrowRight')

  await Command.execute('Explorer.handleArrowRight')

  const child = Locator('.TreeItem[aria-label="child"]')
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(child).toHaveId('TreeItemActive')
  await expect(child).toHaveAttribute('aria-expanded', 'true')
  await expect(file).toBeVisible()
}
