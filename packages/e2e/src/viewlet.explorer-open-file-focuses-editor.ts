import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-open-file-focuses-editor'

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
  await KeyBoard.press('Enter')
  await Command.execute('Timeout.sleep', 1000)

  // assert
  const editorTab = Locator('.MainTab[title$="file.txt"]')
  const editorInput = Locator('.EditorInput textarea')
  await expect(editorTab).toBeVisible()
  await expect(editorTab).toHaveClass('MainTabPreview')
  await expect(editorInput).toBeFocused()
}
