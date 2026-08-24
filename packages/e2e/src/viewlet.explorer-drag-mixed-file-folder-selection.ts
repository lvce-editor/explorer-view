import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-mixed-file-folder-selection'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/destination`)
  await FileSystem.mkdir(`${tmpDir}/source-folder`)
  await FileSystem.setFiles([
    { content: 'nested', uri: `${tmpDir}/source-folder/nested.txt` },
    { content: 'source', uri: `${tmpDir}/source.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  await Explorer.toggleIndividualSelection(2)

  await Explorer.handleDropIndex([], [], [`${tmpDir}/source-folder`, `${tmpDir}/source.txt`], 0)
  await Explorer.expandRecursively()

  const movedNested = Locator(`.TreeItem[title="${tmpDir}/destination/source-folder/nested.txt"]`)
  const movedFile = Locator(`.TreeItem[title="${tmpDir}/destination/source.txt"]`)
  await expect(movedNested).toBeVisible()
  await expect(movedFile).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/source-folder/nested.txt`, 'nested')
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/source.txt`, 'source')
}
