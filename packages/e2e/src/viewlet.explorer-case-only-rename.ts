import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-case-only-rename'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('File.txt')
  await Explorer.acceptEdit()

  // assert
  const renamed = Locator('.TreeItem[aria-label="File.txt"]')
  const old = Locator('.TreeItem[aria-label="file.txt"]')
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(1)
  await expect(renamed).toBeVisible()
  await expect(renamed).toHaveId('TreeItemActive')
  await expect(old).toBeHidden()
  await FileSystem.shouldHaveFile(`${tmpDir}/File.txt`, 'content')
}
