import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-nested-file-collapsed'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const nestedFilePath = `${tmpDir}/a/b/c.txt`
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await FileSystem.writeFile(nestedFilePath, 'content')
  await Workspace.setPath(tmpDir)
  const folderA = Locator('.TreeItem[aria-label="a"]')
  const folderB = Locator('.TreeItem[aria-label="b"]')
  const nestedFile = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(folderA).toHaveAttribute('aria-expanded', 'false')
  await expect(folderB).toBeHidden()
  await expect(nestedFile).toBeHidden()

  // act
  await Command.execute('Explorer.reveal', nestedFilePath)

  // assert
  await expect(folderA).toHaveAttribute('aria-expanded', 'true')
  await expect(folderB).toHaveAttribute('aria-expanded', 'true')
  await expect(nestedFile).toBeVisible()
  await expect(nestedFile).toHaveId('TreeItemActive')
}
