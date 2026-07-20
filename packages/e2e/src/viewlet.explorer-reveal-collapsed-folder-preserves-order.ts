import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-collapsed-folder-preserves-order'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const nestedFilePath = `${tmpDir}/a/b/c.txt`
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await FileSystem.writeFile(nestedFilePath, 'content')
  await FileSystem.writeFile(`${tmpDir}/z.txt`, 'content')
  await Workspace.setPath(tmpDir)
  const folderA = Locator('.TreeItem[aria-label="a"]')
  const folderB = Locator('.TreeItem[aria-label="b"]')
  const nestedFile = Locator('.TreeItem[aria-label="c.txt"]')
  const rootFile = Locator('.TreeItem[aria-label="z.txt"]')
  await Explorer.focusIndex(0)
  await expect(folderA).toHaveId('TreeItemActive')
  await expect(folderB).toBeHidden()
  await expect(nestedFile).toBeHidden()

  // act
  await Explorer.reveal(nestedFilePath)

  // assert
  await expect(nestedFile).toHaveId('TreeItemActive')
  await Explorer.focusIndex(0)
  await expect(folderA).toHaveId('TreeItemActive')
  await Explorer.focusIndex(1)
  await expect(folderB).toHaveId('TreeItemActive')
  await Explorer.focusIndex(2)
  await expect(nestedFile).toHaveId('TreeItemActive')
  await Explorer.focusIndex(3)
  await expect(rootFile).toHaveId('TreeItemActive')
}
