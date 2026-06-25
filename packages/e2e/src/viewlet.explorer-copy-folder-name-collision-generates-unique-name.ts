import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-folder-name-collision-generates-unique-name'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/target`)
  await FileSystem.mkdir(`${tmpDir}/target/source`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  const opfsRoot = await navigator.storage.getDirectory()
  const sourceHandle = await opfsRoot.getDirectoryHandle('source', { create: true })
  const nestedHandle = await sourceHandle.getFileHandle('file.txt', { create: true })
  const writable = await nestedHandle.createWritable({ keepExistingData: false })
  await writable.write('content')
  await writable.close()

  // act
  await Explorer.handleDropIndex([sourceHandle], [], [], 1)
  await Explorer.expandAll()

  // assert
  const originalCollision = Locator(`.TreeItem[title="${tmpDir}/target/source"]`)
  const copiedChild = Locator(`.TreeItem[title="${tmpDir}/target/source/file.txt"]`)
  await expect(originalCollision).toBeVisible()
  await expect(copiedChild).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/target/source/file.txt`, 'content')
}
