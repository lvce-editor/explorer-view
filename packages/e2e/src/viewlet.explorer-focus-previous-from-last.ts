import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-previous-from-last'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  await Explorer.focusPrevious()

  const secondFile = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(secondFile).toHaveId('TreeItemActive')
}
