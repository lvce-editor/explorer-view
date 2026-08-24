import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-new-folder-preserves-expanded-subtree'

export const skip = ['webkit']

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: '', uri: `${tmpDir}/sample-files/files/big_buck_bunny.mp4` },
    { content: '', uri: `${tmpDir}/sample-files/files/big_buck_bunny.webm` },
    { content: '', uri: `${tmpDir}/sample-files/files/echo-hereweare.ogv` },
    { content: '{}', uri: `${tmpDir}/sample-files/package.json` },
    { content: '', uri: `${tmpDir}/scripts/test.js` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.clickCurrent()
  await Explorer.focusIndex(1)
  await Explorer.clickCurrent()

  // act
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('New Folder...')

  // assert
  const treeItems = Locator('.TreeItem')
  const sampleFiles = treeItems.nth(0)
  const files = treeItems.nth(1)
  const mp4 = treeItems.nth(2)
  const webm = treeItems.nth(3)
  const ogv = treeItems.nth(4)
  const packageJson = treeItems.nth(5)
  const inputRow = treeItems.nth(6)
  const scripts = treeItems.nth(7)
  await expect(treeItems).toHaveCount(8)
  await expect(sampleFiles).toHaveText('sample-files')
  await expect(files).toHaveText('files')
  await expect(mp4).toHaveText('big_buck_bunny.mp4')
  await expect(webm).toHaveText('big_buck_bunny.webm')
  await expect(ogv).toHaveText('echo-hereweare.ogv')
  await expect(packageJson).toHaveText('package.json')
  await expect(inputRow.locator('input')).toBeFocused()
  await expect(inputRow).toHaveAttribute('aria-level', '2')
  await expect(scripts).toHaveText('scripts')
}
