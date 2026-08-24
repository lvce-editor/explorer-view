import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-accept-edit-when-not-editing'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])

  await Workspace.setPath(tmpDir)

  // act - call acceptEdit when not in editing mode
  await Explorer.acceptEdit()

  // assert - should not cause any errors and explorer should remain unchanged
  const items = Locator('.TreeItem')
  await expect(items).toHaveCount(3)

  const file1 = Locator('text=file1.txt')
  await expect(file1).toBeVisible()

  const file2 = Locator('text=file2.txt')
  await expect(file2).toBeVisible()

  const file3 = Locator('text=file3.txt')
  await expect(file3).toBeVisible()

  // assert - no input box should be visible since we're not in editing mode
  const inputBox = Locator('input')
  await expect(inputBox).toBeHidden()
}
