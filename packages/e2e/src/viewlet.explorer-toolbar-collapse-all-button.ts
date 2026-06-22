import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-collapse-all-button'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder/nested`)
  await FileSystem.writeFile(`${tmpDir}/folder/nested/file.txt`, 'content')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'content')
  await Workspace.setPath(tmpDir)

  // expand folder
  const folder = Locator('.TreeItem[aria-label="folder"]')
  await folder.click()
  await expect(folder).toHaveAttribute('aria-expanded', 'true')

  // act
  const collapseAllButton = Locator('button[name="CollapseAll"]')
  await collapseAllButton.click()

  // assert
  await expect(folder).toHaveAttribute('aria-expanded', 'false')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(rootFile).toBeVisible()
}
