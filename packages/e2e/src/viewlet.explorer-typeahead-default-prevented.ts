import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-default-prevented'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/alpha.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/beta.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  await Command.execute('Explorer.handleKeyDown', true, 'b')

  const alpha = Locator('.TreeItem[aria-label="alpha.txt"]')
  await expect(alpha).toHaveId('TreeItemActive')
}
