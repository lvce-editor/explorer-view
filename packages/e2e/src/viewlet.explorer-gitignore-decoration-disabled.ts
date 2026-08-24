import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-gitignore-decoration-disabled'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.gitIgnoreDecorations': false,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/debug.log` },
    { content: '*.log', uri: `${tmpDir}/.gitignore` },
  ])

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const debug = Locator('.TreeItem[aria-label="debug.log"] .Label')
  await expect(debug).toHaveJSProperty('className', 'Label')
}
