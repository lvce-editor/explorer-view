import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-right-file-no-op'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act
  await Explorer.handleArrowRight()

  // assert
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  const editorTab = Locator('.MainTab[title$="file.txt"]')
  await expect(file).toHaveId('TreeItemActive')
  await expect(editorTab).toBeHidden()
}
