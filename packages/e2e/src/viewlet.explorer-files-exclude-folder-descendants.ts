import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-files-exclude-folder-descendants'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/secret/deep`)
  await FileSystem.writeFile(`${tmpDir}/secret/deep/passwords.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/visible.txt`, '')
  await Settings.update({ 'files.exclude': { '**/secret': true } })
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  const secretFolder = Locator('.TreeItem[aria-label="secret"]')
  const passwordFile = Locator('.TreeItem[aria-label="passwords.txt"]')
  const treeItems = Locator('.TreeItem')
  await expect(secretFolder).toBeHidden()
  await expect(passwordFile).toBeHidden()
  await expect(treeItems).toHaveCount(1)
}
