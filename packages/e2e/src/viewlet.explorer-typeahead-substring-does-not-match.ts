import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-typeahead-substring-does-not-match'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/alpha.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/snap.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)

  await Explorer.handleKeyDown(false, 'a')

  const alpha = Locator('.TreeItem[aria-label="alpha.txt"]')
  await expect(alpha).toHaveId('TreeItemActive')
}
