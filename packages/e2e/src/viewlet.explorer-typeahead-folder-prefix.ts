import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-folder-prefix'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/alpha`)
  await FileSystem.mkdir(`${tmpDir}/beta`)
  await FileSystem.writeFile(`${tmpDir}/charlie.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusLast()

  await Explorer.handleKeyDown(false, 'b')

  const beta = Locator('.TreeItem[aria-label="beta"]')
  await expect(beta).toHaveId('TreeItemActive')
}
