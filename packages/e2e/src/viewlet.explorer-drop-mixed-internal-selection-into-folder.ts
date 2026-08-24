import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-mixed-internal-selection-into-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/destination`)
  await FileSystem.mkdir(`${tmpDir}/source-folder`)
  await FileSystem.setFiles([
    { content: 'nested', uri: `${tmpDir}/source-folder/nested.txt` },
    { content: 'source', uri: `${tmpDir}/source.txt` },
  ])
  await Workspace.setPath(tmpDir)

  await Explorer.handleDropIndex([], [], [`${tmpDir}/source-folder`, `${tmpDir}/source.txt`], 0)
  await Explorer.expandRecursively()

  const originalFolder = Locator(`.TreeItem[title="${tmpDir}/source-folder"]`)
  const originalFile = Locator(`.TreeItem[title="${tmpDir}/source.txt"]`)
  const movedNested = Locator(`.TreeItem[title="${tmpDir}/destination/source-folder/nested.txt"]`)
  const movedFile = Locator(`.TreeItem[title="${tmpDir}/destination/source.txt"]`)
  await expect(originalFolder).toBeHidden()
  await expect(originalFile).toBeHidden()
  await expect(movedNested).toBeVisible()
  await expect(movedFile).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/source-folder/nested.txt`, 'nested')
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/source.txt`, 'source')
}
