import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-multiple-internal-files-on-file-row'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.setFiles([
    { content: 'target', uri: `${tmpDir}/folder/target.txt` },
    { content: 'one', uri: `${tmpDir}/one.txt` },
    { content: 'two', uri: `${tmpDir}/two.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  await Explorer.handleDropIndex([], [], [`${tmpDir}/one.txt`, `${tmpDir}/two.txt`], 1)

  const movedOne = Locator(`.TreeItem[title="${tmpDir}/folder/one.txt"]`)
  const movedTwo = Locator(`.TreeItem[title="${tmpDir}/folder/two.txt"]`)
  const invalidOne = Locator(`.TreeItem[title="${tmpDir}/folder/target.txt/one.txt"]`)
  await expect(movedOne).toBeVisible()
  await expect(movedTwo).toBeVisible()
  await expect(invalidOne).toBeHidden()
  await FileSystem.shouldHaveFile(`${tmpDir}/folder/one.txt`, 'one')
  await FileSystem.shouldHaveFile(`${tmpDir}/folder/two.txt`, 'two')
}
