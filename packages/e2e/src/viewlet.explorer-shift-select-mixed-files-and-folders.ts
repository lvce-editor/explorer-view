import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-shift-select-mixed-files-and-folders'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a-folder`)
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)

  await Explorer.focusIndex(0)
  await Explorer.handleClickAt(false, 0, false, true, 300, 105)

  for (const name of ['a-folder', 'b.txt', 'c.txt']) {
    const item = Locator(`.TreeItem[aria-label="${name}"]`)
    await expect(item).toHaveClass('TreeItemActive')
  }
}
