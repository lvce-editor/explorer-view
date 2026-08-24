import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-file-twice'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Platform, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)
  const file3 = Locator('.TreeItem', { hasText: 'file3.txt' })
  const file4 = Locator('.TreeItem', { hasText: 'file4.txt' })

  // act
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('file4.txt')
  await Explorer.acceptEdit()
  await Explorer.refresh()
  await expect(file3).toBeHidden()
  await expect(file4).toBeVisible()
  // Firefox cannot reliably reuse a file name immediately after renaming it.
  if (Platform.isFirefox()) {
    return
  }
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('file3.txt')
  await Explorer.acceptEdit()
  await Explorer.refresh()

  // assert
  await expect(file4).toBeHidden()
  await expect(file3).toBeVisible()
}
