import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-shift-select-files-backward'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
    { content: '', uri: `${tmpDir}/d.txt` },
  ])
  await Workspace.setPath(tmpDir)

  await Explorer.focusIndex(3)
  await Explorer.handleClickAt(false, 0, false, true, 300, 65)

  for (const name of ['a.txt', 'b.txt', 'c.txt', 'd.txt']) {
    const item = Locator(`.TreeItem[aria-label="${name}"]`)
    await expect(item).toHaveClass('TreeItemActive')
  }
}
