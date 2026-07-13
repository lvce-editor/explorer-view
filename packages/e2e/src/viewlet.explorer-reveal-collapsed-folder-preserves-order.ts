import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-collapsed-folder-preserves-order'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
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
  await expect(folderA).toBeVisible()
  await expect(folderB).toBeHidden()
  await expect(nestedFile).toBeHidden()
  await expect(rootFile).toBeVisible()

  // act
  await Command.execute('Explorer.reveal', nestedFilePath)

  // assert
  await expect(folderA).toBeVisible()
  await expect(folderB).toBeVisible()
  await expect(nestedFile).toBeVisible()
  await expect(nestedFile).toHaveId('TreeItemActive')
  await Explorer.focusIndex(3)
  await expect(rootFile).toHaveId('TreeItemActive')
}
