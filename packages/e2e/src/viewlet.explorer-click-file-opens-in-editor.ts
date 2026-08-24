import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-click-file-opens-in-editor'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.handleClick(1)

  // assert - the file should be opened in the editor
  const editorTab = Locator('.MainTab[title$="file2.txt"]')
  await expect(editorTab).toBeVisible()
  await expect(editorTab).toHaveClass('MainTabPreview')
  await expect(editorTab).toHaveCSS('font-style', 'italic')
}
