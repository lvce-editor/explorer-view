import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-left-expanded-top-level-folder-keeps-root-sibling-visible'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Command.execute('Explorer.handleArrowRight')

  await Explorer.handleArrowLeft()

  const folder = Locator('.TreeItem[aria-label="folder"]')
  const child = Locator('.TreeItem[aria-label="child.txt"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  await expect(folder).toHaveId('TreeItemActive')
  await expect(child).toBeHidden()
  await expect(rootFile).toBeVisible()
}
