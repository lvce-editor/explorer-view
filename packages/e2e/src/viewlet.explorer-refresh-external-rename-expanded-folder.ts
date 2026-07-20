import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-rename-expanded-folder'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/before`)
  await FileSystem.writeFile(`${tmpDir}/before/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await FileSystem.rename(`${tmpDir}/before`, `${tmpDir}/after`)
  await Explorer.refresh()

  // assert
  const before = Locator('.TreeItem[aria-label="before"]')
  const after = Locator('.TreeItem[aria-label="after"]')
  const child = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(before).toBeHidden()
  await expect(after).toBeVisible()
  await expect(after).toHaveAttribute('aria-expanded', 'true')
  await expect(child).toHaveAttribute('title', `${tmpDir}/after/file.txt`)
}
