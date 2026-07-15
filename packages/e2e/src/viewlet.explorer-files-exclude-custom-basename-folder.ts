import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-custom-basename-folder'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/app/node_modules`)
  await FileSystem.writeFile(`${tmpDir}/app/node_modules/package.json`, '')
  await FileSystem.writeFile(`${tmpDir}/app/index.js`, '')
  await Settings.update({ 'files.exclude': { node_modules: true } })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const nodeModules = Locator('.TreeItem[aria-label="node_modules"]')
  const indexFile = Locator('.TreeItem[aria-label="index.js"]')
  await expect(nodeModules).toBeHidden()
  await expect(indexFile).toBeVisible()
}
