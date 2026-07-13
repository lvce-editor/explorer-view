import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-gitignore-decoration-include'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.gitIgnoreDecorations': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/debug.log`, '')
  await FileSystem.writeFile(`${tmpDir}/important.log`, '')
  await FileSystem.writeFile(`${tmpDir}/.gitignore`, '*.log\n!important.log')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const debug = Locator('.TreeItem[aria-label="debug.log"] .Label')
  const important = Locator('.TreeItem[aria-label="important.log"] .Label')
  await expect(debug).toHaveClass('LabelCut')
  await expect(important).toHaveJSProperty('className', 'Label')
}
