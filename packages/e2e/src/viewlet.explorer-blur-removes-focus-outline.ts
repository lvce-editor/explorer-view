import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-blur-removes-focus-outline'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, KeyBoard, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([{ content: 'content', uri: `${tmpDir}/file.txt` }])
  await Workspace.setUri(tmpDir)
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)
  await KeyBoard.press('Enter')

  const explorerItems = Locator('.Explorer .ListItems')
  const focusedListItems = Locator('.Explorer .ListItems.FocusOutline')
  const editorInput = Locator('.EditorInput textarea')
  const editorCursor = Locator('.Editor .EditorCursor')
  await expect(editorInput).toBeFocused()
  const components = (await Command.execute('ComponentState.getComponents')) as readonly { moduleId: string; uid: number }[]
  const editor = components.find((component) => component.moduleId === 'Editor')
  if (!editor) {
    throw new Error('Editor component not found')
  }
  const focusEditorInput = async (): Promise<void> => {
    await Command.execute('Viewlet.focusSelector', editor.uid, '.EditorInput textarea')
    // DOM focus dispatches the editor's asynchronous focus handler. Wait for
    // its render before moving focus away, so that render cannot reclaim focus.
    await expect(editorCursor).toBeVisible()
  }

  // With no focused item, the list itself receives the focus outline.
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(-1)
  await expect(focusedListItems).toBeVisible()
  await expect(focusedListItems).toHaveCSS('outline-style', 'solid')
  await expect(explorerItems).toBeFocused()

  // Moving focus back to the editor must remove the outline.
  await focusEditorInput()
  await expect(editorInput).toBeFocused()
  await expect(explorerItems).toHaveClass('ListItems')
  await expect(focusedListItems).toBeHidden()
  await expect(explorerItems).toHaveCSS('outline-style', 'none')

  // Refocusing Explorer restores the list-level indicator.
  await Command.execute('Explorer.focus')
  await expect(focusedListItems).toBeVisible()
  await expect(focusedListItems).toHaveCSS('outline-style', 'solid')
  await expect(explorerItems).toBeFocused()

  // Item-level focus must also lose its outline when focus leaves Explorer.
  await Explorer.focusIndex(0)
  const focusedItem = Locator('#TreeItemActive')
  await expect(focusedItem).toBeVisible()
  await expect(explorerItems).toHaveClass('ListItems')
  await expect(focusedListItems).toBeHidden()
  await expect(explorerItems).toBeFocused()
  await focusEditorInput()
  await expect(editorInput).toBeFocused()
  await expect(explorerItems).toHaveClass('ListItems')
  await expect(focusedListItems).toBeHidden()
  await expect(explorerItems).toHaveCSS('outline-style', 'none')
}
