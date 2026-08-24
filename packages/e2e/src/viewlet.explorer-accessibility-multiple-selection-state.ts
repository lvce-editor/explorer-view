import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-accessibility-multiple-selection-state'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a.txt` },
    { content: '', uri: `${tmpDir}/b.txt` },
    { content: '', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.selectIndices([0, 1])

  // assert
  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  const c = Locator('.TreeItem[aria-label="c.txt"]')
  await expect(a).toHaveAttribute('aria-selected', 'true')
  await expect(b).toHaveAttribute('aria-selected', 'true')
  await expect(c).toHaveAttribute('aria-selected', null)
}
