import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-enter-focuses-editor-after-space'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content', uri: `${tmpDir}/a.txt` },
    { content: 'content', uri: `${tmpDir}/b.txt` },
  ])
  await Workspace.setUri(tmpDir)
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)

  // act: Space opens the file while keeping focus in Explorer.
  await KeyBoard.press('Space')

  // assert: Enter on the same file transfers focus to the editor.
  const explorerItems = Locator('.Explorer .ListItems')
  const editorInput = Locator('.EditorInput textarea')
  const firstFile = Locator('.TreeItem[title$="/a.txt"]')
  const secondFile = Locator('.TreeItem[title$="/b.txt"]')
  await expect(explorerItems).toBeFocused()
  await KeyBoard.press('ArrowDown')
  await expect(secondFile).toHaveId('TreeItemActive')
  await KeyBoard.press('ArrowUp')
  await expect(firstFile).toHaveId('TreeItemActive')
  await KeyBoard.press('Enter')
  await expect(editorInput).toBeFocused()

  // act: open another file without focus, then return to the original inactive tab with Enter.
  await Command.execute('Explorer.focus')
  await KeyBoard.press('ArrowDown')
  await KeyBoard.press('Space')
  await Command.execute('Explorer.focus')
  await KeyBoard.press('ArrowUp')
  await KeyBoard.press('Enter')

  // assert
  await expect(editorInput).toBeFocused()
}
