import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-next-expanded-parent-to-child'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()

  await Explorer.focusNext()

  const child = Locator('.TreeItem[aria-label="child.txt"]')
  await expect(child).toHaveId('TreeItemActive')
}
