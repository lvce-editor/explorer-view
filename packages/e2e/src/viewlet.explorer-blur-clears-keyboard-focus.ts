import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-blur-clears-keyboard-focus'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)

  const explorerItems = Locator('.Explorer .ListItems')
  await expect(explorerItems).toBeFocused()

  await Explorer.handleBlur()
  await KeyBoard.press('Space')

  const editorTab = Locator('.MainTab[title$="file.txt"]')
  await expect(editorTab).toBeHidden()
}
