import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-right-expanding-one-folder-keeps-sibling-collapsed'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.mkdir(`${tmpDir}/b`)
  await FileSystem.writeFile(`${tmpDir}/a/a.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/b/b.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  await Command.execute('Explorer.handleArrowRight')

  const firstFolder = Locator('.TreeItem[aria-label="a"]')
  const secondFolder = Locator('.TreeItem[aria-label="b"]')
  const firstFile = Locator('.TreeItem[aria-label="a.txt"]')
  const secondFile = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(firstFolder).toHaveAttribute('aria-expanded', 'true')
  await expect(secondFolder).toHaveAttribute('aria-expanded', 'false')
  await expect(firstFile).toBeVisible()
  await expect(secondFile).toBeHidden()
}
