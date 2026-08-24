import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-select-for-compare'

export const skip = ['webkit']

export const test: Test = async ({ ContextMenu, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.openContextMenu(0)
  await ContextMenu.selectItem('Select for Compare')

  // act
  await Explorer.openContextMenu(1)

  // assert
  const compareWithSelected = Locator('text=Compare with Selected')
  await expect(compareWithSelected).toBeVisible()
  await ContextMenu.selectItem('Compare with Selected')
  const diffEditor = Locator('.DiffEditor')
  await expect(diffEditor).toBeVisible()
}
