import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-preview-tab-replaced'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'first', uri: `${tmpDir}/a-first.txt` },
    { content: 'second', uri: `${tmpDir}/b-second.txt` },
  ])
  await Workspace.setPath(tmpDir)

  await Explorer.handleClick(0)
  await Explorer.handleClick(1)

  const firstTab = Locator('.MainTab[title$="a-first.txt"]')
  const secondTab = Locator('.MainTabPreview[title$="b-second.txt"]')
  const tabs = Locator('.MainTab')
  await expect(firstTab).toBeHidden()
  await expect(secondTab).toBeVisible()
  await expect(tabs).toHaveCount(1)
}
