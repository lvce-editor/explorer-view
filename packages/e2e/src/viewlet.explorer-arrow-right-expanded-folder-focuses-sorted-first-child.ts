import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-right-expanded-folder-focuses-sorted-first-child'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/z.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Command.execute('Explorer.handleArrowRight')

  await Command.execute('Explorer.handleArrowRight')

  const firstChild = Locator('.TreeItem[aria-label="a.txt"]')
  const secondChild = Locator('.TreeItem[aria-label="z.txt"]')
  await expect(firstChild).toHaveId('TreeItemActive')
  await expect(secondChild).toBeVisible()
}
