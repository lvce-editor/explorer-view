import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-undo-create-folder'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/existing.txt`, 'content')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFolder()
  await Explorer.updateEditingValue('folder')
  await Explorer.acceptEdit()
  await (Explorer as typeof Explorer & { undo: () => Promise<void> }).undo()

  // assert
  const folder = Locator('.TreeItem', { hasText: 'folder' })
  await expect(folder).toBeHidden()
}
