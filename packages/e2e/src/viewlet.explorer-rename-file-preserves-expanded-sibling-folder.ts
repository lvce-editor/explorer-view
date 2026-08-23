import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-preserves-expanded-sibling-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a/child.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/a.json`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()

  // act
  await Explorer.focusIndex(2)
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('b.json')
  await Explorer.acceptEdit()

  // assert
  const folder = Locator('.TreeItem[aria-label="a"]')
  const child = Locator('.TreeItem[aria-label="child.txt"]')
  const renamedFile = Locator('.TreeItem[aria-label="b.json"]')
  await expect(folder).toHaveAttribute('aria-expanded', 'true')
  await expect(child).toBeVisible()
  await expect(renamedFile).toBeVisible()
}
