import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-selected-secondary-includes-focused-file'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/destination`)
  await FileSystem.setFiles([
    { content: 'a', uri: `${tmpDir}/a.txt` },
    { content: 'b', uri: `${tmpDir}/b.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  await Explorer.toggleIndividualSelection(2)

  await Explorer.handleDropIndex([], [`${tmpDir}/a.txt`, `${tmpDir}/b.txt`], 0)

  const movedA = Locator(`.TreeItem[title="${tmpDir}/destination/a.txt"]`)
  const movedB = Locator(`.TreeItem[title="${tmpDir}/destination/b.txt"]`)
  await expect(movedA).toBeVisible()
  await expect(movedB).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/a.txt`, 'a')
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/b.txt`, 'b')
}
