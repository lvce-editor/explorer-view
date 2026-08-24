import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-multiple-internal-files-into-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/destination`)
  await FileSystem.setFiles([
    { content: 'one', uri: `${tmpDir}/one.txt` },
    { content: 'two', uri: `${tmpDir}/two.txt` },
  ])
  await Workspace.setPath(tmpDir)

  await Explorer.handleDropIndex([], [], [`${tmpDir}/one.txt`, `${tmpDir}/two.txt`], 0)

  const originalOne = Locator(`.TreeItem[title="${tmpDir}/one.txt"]`)
  const originalTwo = Locator(`.TreeItem[title="${tmpDir}/two.txt"]`)
  const movedOne = Locator(`.TreeItem[title="${tmpDir}/destination/one.txt"]`)
  const movedTwo = Locator(`.TreeItem[title="${tmpDir}/destination/two.txt"]`)
  await expect(originalOne).toBeHidden()
  await expect(originalTwo).toBeHidden()
  await expect(movedOne).toBeVisible()
  await expect(movedTwo).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/one.txt`, 'one')
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/two.txt`, 'two')
}
