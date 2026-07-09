import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-gitignore-decoration-nested'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.gitIgnoreDecorations': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/packages`)
  await FileSystem.mkdir(`${tmpDir}/packages/app`)
  await FileSystem.mkdir(`${tmpDir}/packages/other`)
  await FileSystem.writeFile(`${tmpDir}/packages/app/file.tmp`, '')
  await FileSystem.writeFile(`${tmpDir}/packages/other/file.tmp`, '')
  await FileSystem.writeFile(`${tmpDir}/packages/app/.gitignore`, '*.tmp')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()

  // assert
  const ignored = Locator(`.TreeItem[title="${tmpDir}/packages/app/file.tmp"] .Label`)
  const plain = Locator(`.TreeItem[title="${tmpDir}/packages/other/file.tmp"] .Label`)
  await expect(ignored).toHaveClass('LabelCut')
  await expect(plain).toHaveJSProperty('className', 'Label')
}
