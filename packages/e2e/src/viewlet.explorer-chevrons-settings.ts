import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-chevrons-settings'

export const test: Test = async ({ expect, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.useChevrons': true,
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder-a`)
  await FileSystem.mkdir(`${tmpDir}/folder-b`)
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)

  // assert - with chevrons enabled, folders should have chevron icons
  const folderA = Locator('.TreeItem[aria-label="folder-a"]')
  const chevron = folderA.locator('.Chevron')
  await expect(chevron).toBeVisible()
}
