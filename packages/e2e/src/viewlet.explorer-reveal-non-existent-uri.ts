import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-non-existent-uri'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/first.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/second.txt`, '')
  await Workspace.setPath(tmpDir)

  const explorer = Locator('.Explorer')
  const firstFile = Locator('.TreeItem[aria-label="first.txt"]')
  const secondFile = Locator('.TreeItem[aria-label="second.txt"]')
  await expect(explorer).toBeVisible()
  await expect(firstFile).toBeVisible()
  await expect(secondFile).toBeVisible()
  await Explorer.focusIndex(0)
  await expect(firstFile).toHaveId('TreeItemActive')

  // act
  await Command.execute('Explorer.reveal', 'non-existent:///some-file.txt')

  // assert
  await expect(explorer).toBeVisible()
  await expect(firstFile).toBeVisible()
  await expect(secondFile).toBeVisible()
  await expect(firstFile).toHaveId('TreeItemActive')
}
