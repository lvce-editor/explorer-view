import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-rename-root-file'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/before.txt`, 'content')
  await Workspace.setPath(tmpDir)
  const before = Locator('.TreeItem[aria-label="before.txt"]')
  await expect(before).toBeVisible()

  // act
  await FileSystem.remove(`${tmpDir}/before.txt`)
  await FileSystem.writeFile(`${tmpDir}/after.txt`, 'content')
  await Explorer.refresh()

  // assert
  const after = Locator('.TreeItem[aria-label="after.txt"]')
  const treeItems = Locator('.TreeItem')
  await expect(before).toBeHidden()
  await expect(after).toBeVisible()
  await expect(treeItems).toHaveCount(1)
}
