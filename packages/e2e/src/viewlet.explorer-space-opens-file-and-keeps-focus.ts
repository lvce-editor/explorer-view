import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-space-opens-file-and-keeps-focus'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)
  const explorerItems = Locator('.Explorer .ListItems')
  await expect(explorerItems).toBeFocused()

  // act
  await KeyBoard.press('Space')

  // assert
  const editorTab = Locator('.MainTab[title$="file.txt"]')
  await expect(editorTab).toBeVisible()
  await expect(editorTab).toHaveClass('MainTabPreview')
  await expect(explorerItems).toBeFocused()
}
