import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-shift-select-files-forward'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/d.txt`, '')
  await Workspace.setPath(tmpDir)

  await Explorer.focusIndex(0)
  await Explorer.handleClickAt(false, 0, false, true, 300, 125)

  for (const name of ['a.txt', 'b.txt', 'c.txt', 'd.txt']) {
    const item = Locator(`.TreeItem[aria-label="${name}"]`)
    await expect(item).toHaveClass('TreeItemActive')
  }
}
