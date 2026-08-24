import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-next-from-middle'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)

  await Explorer.focusNext()

  const lastFile = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(lastFile).toHaveId('TreeItemActive')
}
