import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-double-click-file-opens-permanently'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'content')
  await Workspace.setPath(tmpDir)

  await Command.execute('Explorer.handleDoubleClick', 20, 10)

  const editorTab = Locator('.MainTab:not(.MainTabPreview)[title$="test.txt"]')
  await expect(editorTab).toBeVisible()
}
