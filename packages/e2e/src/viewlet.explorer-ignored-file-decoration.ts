import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-ignored-file-decoration'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.gitIgnoreDecorations': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/a` },
    { content: '', uri: `${tmpDir}/b` },
    { content: 'a', uri: `${tmpDir}/.gitignore` },
  ])

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const a = Locator('.TreeItem[aria-label="a"]')
  const b = Locator('.TreeItem[aria-label="b"]')
  const aLabel = a.locator('.Label')
  const bLabel = b.locator('.Label')
  await expect(a).toBeVisible()
  await expect(aLabel).toHaveClass('LabelCut')
  await expect(bLabel).toHaveJSProperty('className', 'Label')
}
