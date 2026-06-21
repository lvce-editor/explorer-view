import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-on-file-row'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/target.txt`, '')
  await Workspace.setPath(tmpDir)
  const opfsRoot = await navigator.storage.getDirectory()
  const fileHandle = await opfsRoot.getFileHandle('dropped.txt', { create: true })

  // act
  await Explorer.handleDropIndex([fileHandle], [], [], 0)

  // assert
  const droppedAtRoot = Locator(`.TreeItem[title="${tmpDir}/dropped.txt"]`)
  const droppedInsideFile = Locator(`.TreeItem[title="${tmpDir}/target.txt/dropped.txt"]`)
  await expect(droppedAtRoot).toBeVisible()
  await expect(droppedInsideFile).toBeHidden()
}
