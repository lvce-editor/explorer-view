import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-cycle-after-reset'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/alpha.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/banana.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/berry.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Command.execute('Explorer.handleKeyDown', false, 'b')
  const banana = Locator('.TreeItem[aria-label="banana.txt"]')
  await expect(banana).toHaveId('TreeItemActive')

  await Command.execute('Explorer.handleKeyDown', false, '')
  await Command.execute('Explorer.handleKeyDown', false, 'b')

  const berry = Locator('.TreeItem[aria-label="berry.txt"]')
  await expect(berry).toHaveId('TreeItemActive')
}
