import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-gitignore-decoration-cached-after-reopen'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  await Settings.update({
    'explorer.gitIgnoreDecorations': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/packages`)
  await FileSystem.mkdir(`${tmpDir}/packages/app`)
  await FileSystem.mkdir(`${tmpDir}/packages/app/node_modules`)
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/packages/app/node_modules/package.json` },
    { content: 'packages/app/node_modules', uri: `${tmpDir}/.gitignore` },
  ])
  await Workspace.setUri(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.collapseAll()

  await Explorer.handleClick(0)
  await Explorer.handleClick(1)

  const nodeModules = Locator('.TreeItem[aria-label="node_modules"] .Label')
  await expect(nodeModules).toHaveClass('LabelCut')
}
