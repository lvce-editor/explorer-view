import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-multiple-character-prefix'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/banana.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/berry.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/brick.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Command.execute('Explorer.handleKeyDown', false, 'b')
  await Command.execute('Explorer.handleKeyDown', false, 'r')

  const brick = Locator('.TreeItem[aria-label="brick.txt"]')
  await expect(brick).toHaveId('TreeItemActive')
}
