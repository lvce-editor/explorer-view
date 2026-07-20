import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-folder-into-itself'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/file.txt`, '')
  await Workspace.setPath(tmpDir)
  const folderHandle = await FileSystem.getDirectoryHandle(`${tmpDir}/folder`)
  await Explorer.focusFirst()

  // act
  await Explorer.handleDropIndex([folderHandle], [], [], 0)

  // assert
  const folder = Locator('.TreeItem[aria-label="folder"]')
  const duplicate = Locator('.TreeItem[aria-label="folder"]').nth(1)
  await expect(folder).toBeVisible()
  await expect(duplicate).toBeHidden()
}
