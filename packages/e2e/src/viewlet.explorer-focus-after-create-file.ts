import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-after-create-file'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  // Keep this focus test independent of browser-specific font loading behavior.
  await Settings.update({ 'editor.fontFamily': 'monospace' })
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFile()
  await Explorer.updateEditingValue('new-file.txt')
  await Explorer.acceptEdit()

  // assert - the new file should remain selected and the editor should be focused
  const newFile = Locator('.TreeItem[aria-label="new-file.txt"]')
  const editorInput = Locator('.EditorInput textarea')
  await expect(newFile).toBeVisible()
  await expect(newFile).toHaveId('TreeItemActive')
  await expect(editorInput).toBeFocused()
}
