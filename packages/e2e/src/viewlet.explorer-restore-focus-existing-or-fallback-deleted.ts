import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-restore-focus-existing-or-fallback-deleted'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  const savedState = await Command.execute('Explorer.saveState')

  // act
  await FileSystem.remove(`${tmpDir}/b.txt`)
  await Workspace.setPath('')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.restoreState', savedState)

  // assert
  const deleted = Locator('.TreeItem[aria-label="b.txt"]')
  const fallback = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(deleted).toBeHidden()
  await expect(fallback).toHaveId('TreeItemActive')
}
