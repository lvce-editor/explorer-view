import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-gitignore-decoration-globs'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.gitIgnoreDecorations': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/src`)
  await FileSystem.mkdir(`${tmpDir}/src/app`)
  await FileSystem.mkdir(`${tmpDir}/src/app/generated`)
  await FileSystem.writeFile(`${tmpDir}/debug.log`, '')
  await FileSystem.writeFile(`${tmpDir}/src/app/generated/file.ts`, '')
  await FileSystem.writeFile(`${tmpDir}/src/app/generated/file.js`, '')
  await FileSystem.writeFile(`${tmpDir}/.gitignore`, '*.log\nsrc/**/generated/*.ts')

  // act
  await Workspace.setPath(tmpDir)

  // assert
  const debug = Locator('.TreeItem[aria-label="debug.log"] .Label')
  await expect(debug).toHaveClass('LabelCut')
}
