import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-cycle-after-reset'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/alpha.txt` },
    { content: '', uri: `${tmpDir}/banana.txt` },
    { content: '', uri: `${tmpDir}/berry.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Explorer.handleKeyDown(false, 'b')
  const banana = Locator('.TreeItem[aria-label="banana.txt"]')
  await expect(banana).toHaveId('TreeItemActive')

  await Explorer.handleKeyDown(false, '')
  await Explorer.handleKeyDown(false, 'b')

  const berry = Locator('.TreeItem[aria-label="berry.txt"]')
  await expect(berry).toHaveId('TreeItemActive')
}
