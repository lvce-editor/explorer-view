import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-file-twice'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act: two concurrent newFile calls — the editingIndex guard should prevent a duplicate
  await Promise.all([Explorer.newFile(), Explorer.newFile()])

  // assert: only one editing input should exist — 3 files + 1 editing row = 4 tree items
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(4)
}
