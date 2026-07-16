import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-click-pinned-tab-keeps-it-pinned'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const pinnedFile = `${tmpDir}/pinned.txt`
  await FileSystem.writeFile(pinnedFile, 'pinned')
  await Workspace.setPath(tmpDir)

  await Main.openUri(pinnedFile)
  await Explorer.handleClick(0)

  const tab = Locator('.MainTab[title$="pinned.txt"]')
  const tabs = Locator('.MainTab')
  await expect(tab).toBeVisible()
  await expect(tab).not.toHaveClass('MainTabPreview')
  await expect(tabs).toHaveCount(1)
}
