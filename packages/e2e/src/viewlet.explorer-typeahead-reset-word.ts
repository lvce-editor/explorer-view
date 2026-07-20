import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-reset-word'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/alpha.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/beta.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/charlie.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Command.execute('Explorer.handleKeyDown', false, 'b')
  await Command.execute('Explorer.handleKeyDown', false, '')
  await Command.execute('Explorer.handleKeyDown', false, 'c')

  const charlie = Locator('.TreeItem[aria-label="charlie.txt"]')
  await expect(charlie).toHaveId('TreeItemActive')
}
