import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-shift-selected-range'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/destination`)
  await FileSystem.setFiles([
    { content: 'a', uri: `${tmpDir}/a.txt` },
    { content: 'b', uri: `${tmpDir}/b.txt` },
    { content: 'c', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  await Explorer.handleClickAt(false, 0, false, true, 300, 125)

  await Explorer.handleDropIndex([], [`${tmpDir}/a.txt`, `${tmpDir}/b.txt`, `${tmpDir}/c.txt`], 0)

  for (const file of ['a.txt', 'b.txt', 'c.txt']) {
    const moved = Locator(`.TreeItem[title="${tmpDir}/destination/${file}"]`)
    await expect(moved).toBeVisible()
  }
}
