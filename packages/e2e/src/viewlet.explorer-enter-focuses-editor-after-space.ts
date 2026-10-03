import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-enter-focuses-editor-after-space'

export const skip = 1

export const test: Test = async ({ Command, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'content')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'content')
  await Workspace.setUri(tmpDir)
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)

  // act: Space opens the file while keeping focus in Explorer.
  await Command.execute('Explorer.handleClickCurrentButKeepFocus')

  // assert: Enter on the same file transfers focus to the editor.
  const explorerItems = Locator('.Explorer .ListItems')
  const editorInput = Locator('.EditorInput textarea')
  await expect(explorerItems).toBeFocused()
  await KeyBoard.press('ArrowDown')
  await expect(Locator('.TreeItem[title$="/b.txt"]')).toHaveId('TreeItemActive')
  await Explorer.focusIndex(0)
  await Command.execute('Explorer.handleClickCurrent')
  await expect(editorInput).toBeFocused()

  // act: open another file without focus, then return to the original inactive tab with Enter.
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(1)
  await Command.execute('Explorer.handleClickCurrentButKeepFocus')
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)
  await Command.execute('Explorer.handleClickCurrent')

  // assert
  await expect(editorInput).toBeFocused()
}
