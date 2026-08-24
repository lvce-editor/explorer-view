import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-multiple-character-prefix'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/banana.txt` },
    { content: '', uri: `${tmpDir}/berry.txt` },
    { content: '', uri: `${tmpDir}/brick.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Explorer.handleKeyDown(false, 'b')
  await Explorer.handleKeyDown(false, 'r')

  const brick = Locator('.TreeItem[aria-label="brick.txt"]')
  await expect(brick).toHaveId('TreeItemActive')
}
