import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rapid-toolbar-clicks'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/folder/a.txt` },
    { content: '', uri: `${tmpDir}/root.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Promise.all([Explorer.refresh(), Explorer.collapseAll(), Explorer.newFile()])

  // assert
  const input = Locator('input')
  const inputs = Locator('.Explorer input')
  const folder = Locator('.TreeItem[aria-label="folder"]')
  await expect(inputs).toHaveCount(1)
  await expect(input).toBeVisible()
  await expect(folder).toBeVisible()
}
