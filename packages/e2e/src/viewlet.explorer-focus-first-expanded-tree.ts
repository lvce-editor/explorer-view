import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-first-expanded-tree'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()
  await Explorer.focusLast()

  await Explorer.focusFirst()

  const folder = Locator('.TreeItem[aria-label="folder"]')
  await expect(folder).toHaveId('TreeItemActive')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
}
