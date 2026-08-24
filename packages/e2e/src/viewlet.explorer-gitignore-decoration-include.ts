import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-gitignore-decoration-include'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.gitIgnoreDecorations': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/debug.log` },
    { content: '', uri: `${tmpDir}/important.log` },
    { content: '*.log\n!important.log', uri: `${tmpDir}/.gitignore` },
  ])

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const debug = Locator('.TreeItem[aria-label="debug.log"] .Label')
  const important = Locator('.TreeItem[aria-label="important.log"] .Label')
  await expect(debug).toHaveClass('LabelCut')
  await expect(important).toHaveJSProperty('className', 'Label')
}
