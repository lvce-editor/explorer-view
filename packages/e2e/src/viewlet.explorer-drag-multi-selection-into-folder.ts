import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-multi-selection-into-folder'

export const skip = ['webkit']

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/target`)
  await Workspace.setPath(tmpDir)
  const opfsRoot = await navigator.storage.getDirectory()
  const aHandle = await opfsRoot.getFileHandle('a.txt', { create: true })
  const bHandle = await opfsRoot.getFileHandle('b.txt', { create: true })
  const folderHandle = await opfsRoot.getDirectoryHandle('folder', { create: true })
  const nestedHandle = await folderHandle.getFileHandle('c.txt', { create: true })
  const writableA = await aHandle.createWritable({ keepExistingData: false })
  await writableA.write('a')
  await writableA.close()
  const writableB = await bHandle.createWritable({ keepExistingData: false })
  await writableB.write('b')
  await writableB.close()
  const writableC = await nestedHandle.createWritable({ keepExistingData: false })
  await writableC.write('c')
  await writableC.close()

  // act
  await Explorer.focusIndex(0)
  await Explorer.handleDropIndex([aHandle, bHandle, folderHandle], [], [], 0)
  await Explorer.expandRecursively()

  // assert
  const movedA = Locator(`.TreeItem[title="${tmpDir}/target/a.txt"]`)
  const movedB = Locator(`.TreeItem[title="${tmpDir}/target/b.txt"]`)
  const movedNested = Locator(`.TreeItem[title="${tmpDir}/target/folder/c.txt"]`)
  await expect(movedA).toBeVisible()
  await expect(movedB).toBeVisible()
  await expect(movedNested).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/target/a.txt`, 'a')
  await FileSystem.shouldHaveFile(`${tmpDir}/target/b.txt`, 'b')
  await FileSystem.shouldHaveFile(`${tmpDir}/target/folder/c.txt`, 'c')
}
