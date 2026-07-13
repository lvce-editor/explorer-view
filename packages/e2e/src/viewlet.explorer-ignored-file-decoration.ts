import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-ignored-file-decoration'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.gitIgnoreDecorations': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a`, '')
  await FileSystem.writeFile(`${tmpDir}/b`, '')
  await FileSystem.writeFile(`${tmpDir}/.gitignore`, 'a')

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
