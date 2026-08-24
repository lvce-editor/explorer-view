import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-nested-child'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/folder/child.txt` },
    { content: '', uri: `${tmpDir}/root.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusFirst()

  await Explorer.handleKeyDown(false, 'c')

  const child = Locator('.TreeItem[aria-label="child.txt"]')
  await expect(child).toHaveId('TreeItemActive')
}
