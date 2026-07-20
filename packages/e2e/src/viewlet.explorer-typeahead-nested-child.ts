import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-nested-child'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/child.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusFirst()

  await Command.execute('Explorer.handleKeyDown', false, 'c')

  const child = Locator('.TreeItem[aria-label="child.txt"]')
  await expect(child).toHaveId('TreeItemActive')
}
