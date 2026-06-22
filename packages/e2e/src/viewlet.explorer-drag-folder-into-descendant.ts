import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-folder-into-descendant'

export const skip = 1

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder/child`)
  await FileSystem.writeFile(`${tmpDir}/folder/child/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  const folderHandle = await Command.execute('FileSystemHandle.getDirectoryHandle', `${tmpDir}/folder`)

  // act
  await Explorer.handleDropIndex([folderHandle], [], [], 1)

  // assert
  const original = Locator(`.TreeItem[title="${tmpDir}/folder"]`)
  const nestedDuplicate = Locator(`.TreeItem[title="${tmpDir}/folder/child/folder"]`)
  await expect(original).toBeVisible()
  await expect(nestedDuplicate).toBeHidden()
}
