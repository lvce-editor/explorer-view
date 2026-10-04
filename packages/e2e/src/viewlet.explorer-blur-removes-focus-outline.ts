import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-blur-removes-focus-outline'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([{ content: 'content', uri: `${tmpDir}/file.txt` }])
  await Workspace.setUri(tmpDir)
  await Explorer.focusIndex(0)
  await KeyBoard.press('Enter')

  const explorerItems = Locator('.Explorer .ListItems')
  const editorInput = Locator('.EditorInput textarea')
  await expect(editorInput).toBeFocused()

  // With no focused item, the list itself receives the focus outline.
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(-1)
  await expect(explorerItems).toHaveClass('ListItems FocusOutline')
  await expect(explorerItems).toHaveCSS('outline-style', 'solid')

  // Moving focus back to the editor must remove the outline.
  await editorInput.click()
  await expect(editorInput).toBeFocused()
  await expect(explorerItems).toHaveClass('ListItems')
  await expect(explorerItems).toHaveCSS('outline-style', 'none')

  // Refocusing Explorer restores the list-level indicator.
  await Command.execute('Explorer.focus')
  await expect(explorerItems).toHaveClass('ListItems FocusOutline')
  await expect(explorerItems).toHaveCSS('outline-style', 'solid')

  // Item-level focus must also lose its outline when focus leaves Explorer.
  await Explorer.focusIndex(0)
  await expect(explorerItems).toHaveClass('ListItems')
  await editorInput.click()
  await expect(editorInput).toBeFocused()
  await expect(explorerItems).toHaveClass('ListItems')
  await expect(explorerItems).toHaveCSS('outline-style', 'none')
}
