import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-expanded-folder-updates-child-titles'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/before/nested`)
  await FileSystem.writeFile(`${tmpDir}/before/nested/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusFirst()

  // act
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('after')
  await Explorer.acceptEdit()

  // assert
  const folder = Locator('.TreeItem[aria-label="after"]')
  const nested = Locator('.TreeItem[aria-label="nested"]')
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(folder).toHaveAttribute('title', `${tmpDir}/after`)
  await expect(nested).toHaveAttribute('title', `${tmpDir}/after/nested`)
  await expect(file).toHaveAttribute('title', `${tmpDir}/after/nested/file.txt`)
}
