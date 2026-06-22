import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-accept-edit-blur'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'created.txt')

  // act: acceptEdit and handleInputBlur both try to accept the same edit concurrently
  await Promise.all([Command.execute('Explorer.acceptEdit'), Command.execute('Explorer.handleInputBlur')])

  // assert: explorer should be stable — no crash
  // The file should exist on disk (if created before or by acceptEdit)
  await FileSystem.shouldHaveFile(`${tmpDir}/created.txt`, '')

  // At most 1 created.txt in the tree
  const created = Locator('.TreeItem[aria-label="created.txt"]')
  await expect(created).toHaveCount(1)

  // input should be hidden after accept/blur
  const inputBox = Locator('input')
  await expect(inputBox).toBeHidden()
}
