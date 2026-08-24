import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-gitignore-decoration-nested'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.gitIgnoreDecorations': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/packages`)
  await FileSystem.mkdir(`${tmpDir}/packages/app`)
  await FileSystem.mkdir(`${tmpDir}/packages/other`)
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/packages/app/file.tmp` },
    { content: '', uri: `${tmpDir}/packages/other/file.tmp` },
    { content: '*.tmp', uri: `${tmpDir}/packages/app/.gitignore` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Command.execute('Timeout.sleep', 1000)

  // assert
  const ignored = Locator(`.TreeItem[title="${tmpDir}/packages/app/file.tmp"] .Label`)
  const plain = Locator(`.TreeItem[title="${tmpDir}/packages/other/file.tmp"] .Label`)
  await expect(ignored).toHaveClass('LabelCut')
  await expect(plain).toHaveJSProperty('className', 'Label')
}
