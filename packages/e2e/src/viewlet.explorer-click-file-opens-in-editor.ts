import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-click-file-opens-in-editor'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.handleClick(1)

  // assert - the file should be opened in the editor
  const editorTab = Locator('[title*="file2.txt"]').first()
  await expect(editorTab).toBeVisible()
}
