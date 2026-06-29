import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-undo-delete-file'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.removeDirent()
  await (Explorer as typeof Explorer & { undo: () => Promise<void> }).undo()

  // assert
  const file = Locator('.TreeItem', { hasText: 'file.txt' })
  await expect(file).toBeVisible()
}
