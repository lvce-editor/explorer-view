import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-undo-create-file'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/existing.txt`, 'content')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFile()
  await Explorer.updateEditingValue('created.txt')
  await Explorer.acceptEdit()
  await (Explorer as typeof Explorer & { undo: () => Promise<void> }).undo()

  // assert
  const created = Locator('.TreeItem', { hasText: 'created.txt' })
  await expect(created).toBeHidden()
}
