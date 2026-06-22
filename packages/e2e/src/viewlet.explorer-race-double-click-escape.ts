import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-double-click-escape'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act: double-click on empty space creates a new file input, escape cancels it — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleDoubleClick', 20, 100), Command.execute('Explorer.handleEscape')])

  // assert: explorer should be stable — either input is visible (double-click won) or hidden (escape won), but not both
  const items = Locator('.TreeItem')
  await expect(items).toHaveCount(1)
}
