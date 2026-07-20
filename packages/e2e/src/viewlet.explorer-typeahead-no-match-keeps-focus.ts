import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-no-match-keeps-focus'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/alpha.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/beta.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)

  await Command.execute('Explorer.handleKeyDown', false, 'z')

  const beta = Locator('.TreeItem[aria-label="beta.txt"]')
  await expect(beta).toHaveId('TreeItemActive')
}
