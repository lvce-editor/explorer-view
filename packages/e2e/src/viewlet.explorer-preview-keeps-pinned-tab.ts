import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-preview-keeps-pinned-tab'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const pinnedFile = `${tmpDir}/a-pinned.txt`
  await FileSystem.setFiles([
    { content: 'pinned', uri: pinnedFile },
    { content: 'preview', uri: `${tmpDir}/b-preview.txt` },
  ])
  await Workspace.setPath(tmpDir)

  await Main.openUri(pinnedFile)
  await Explorer.handleClick(1)

  const pinnedTab = Locator('.MainTab[title$="a-pinned.txt"]')
  const previewTab = Locator('.MainTabPreview[title$="b-preview.txt"]')
  const tabs = Locator('.MainTab')
  await expect(pinnedTab).toBeVisible()
  await expect(previewTab).toBeVisible()
  await expect(tabs).toHaveCount(2)
}
