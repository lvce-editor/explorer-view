import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-cut-folder-into-expanded-folder'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/source/nested`)
  await FileSystem.mkdir(`${tmpDir}/target`)
  await FileSystem.writeFile(`${tmpDir}/source/nested/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Explorer.focusIndex(0)
  await Explorer.handleCut()
  await Explorer.focusIndex(3)
  await Explorer.handlePaste()
  await Explorer.expandRecursively()

  // assert
  const oldSource = Locator(`.TreeItem[title="${tmpDir}/source"]`)
  const movedFile = Locator(`.TreeItem[title="${tmpDir}/target/source/nested/file.txt"]`)
  await expect(oldSource).toBeHidden()
  await expect(movedFile).toBeVisible()
}
