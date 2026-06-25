import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-undo-rename'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/before.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.renameDirent()
  await Explorer.updateEditingValue('after.txt')
  await Explorer.acceptEdit()
  await (Explorer as typeof Explorer & { undo: () => Promise<void> }).undo()

  // assert
  const before = Locator('.TreeItem', { hasText: 'before.txt' })
  await expect(before).toBeVisible()
  const after = Locator('.TreeItem', { hasText: 'after.txt' })
  await expect(after).toBeHidden()
}
