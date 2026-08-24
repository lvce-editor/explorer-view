import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-non-ascii-ignored'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/alpha.txt` },
    { content: '', uri: `${tmpDir}/éclair.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Explorer.handleKeyDown(false, 'é')

  const alpha = Locator('.TreeItem[aria-label="alpha.txt"]')
  await expect(alpha).toHaveId('TreeItemActive')
}
