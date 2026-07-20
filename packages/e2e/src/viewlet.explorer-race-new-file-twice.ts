import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-file-twice'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)

  // act: two concurrent newFile calls — the editingIndex guard should prevent a duplicate
  await Promise.all([Command.execute('Explorer.newFile'), Command.execute('Explorer.newFile')])

  // assert: only one editing input should exist — 3 files + 1 editing row = 4 tree items
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(4)
}
