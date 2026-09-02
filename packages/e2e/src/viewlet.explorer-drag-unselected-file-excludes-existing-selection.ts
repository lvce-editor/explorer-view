import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-unselected-file-excludes-existing-selection'

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
  await Explorer.toggleIndividualSelection(2)

  await Explorer.handleDropIndex([], [`${tmpDir}/c.txt`], 0)

  const originalA = Locator(`.TreeItem[title="${tmpDir}/a.txt"]`)
  const originalB = Locator(`.TreeItem[title="${tmpDir}/b.txt"]`)
  const movedC = Locator(`.TreeItem[title="${tmpDir}/destination/c.txt"]`)
  await expect(originalA).toBeVisible()
  await expect(originalB).toBeVisible()
  await expect(movedC).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/a.txt`, 'a')
  await FileSystem.shouldHaveFile(`${tmpDir}/b.txt`, 'b')
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/c.txt`, 'c')
}
