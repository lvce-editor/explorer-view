import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-nested-multi-selection'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/destination`)
  await FileSystem.mkdir(`${tmpDir}/source`)
  await FileSystem.setFiles([
    { content: 'a', uri: `${tmpDir}/source/a.txt` },
    { content: 'b', uri: `${tmpDir}/source/b.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(2)
  await Explorer.toggleIndividualSelection(3)

  await Explorer.handleDropIndex([], [`${tmpDir}/source/a.txt`, `${tmpDir}/source/b.txt`], 0)

  const movedA = Locator(`.TreeItem[title="${tmpDir}/destination/a.txt"]`)
  const movedB = Locator(`.TreeItem[title="${tmpDir}/destination/b.txt"]`)
  await expect(movedA).toBeVisible()
  await expect(movedB).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/a.txt`, 'a')
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/b.txt`, 'b')
}
