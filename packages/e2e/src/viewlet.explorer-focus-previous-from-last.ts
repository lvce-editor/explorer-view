import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-previous-from-last'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  await Command.execute('Explorer.focusPrevious')

  const secondFile = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(secondFile).toHaveId('TreeItemActive')
}
