import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-handle-drag-leave'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.handleDragOver(5000, 5000)

  // assert
  const explorer = Locator('.Explorer .ListItems')
  const dropTarget = Locator('.Explorer .ListItems.DropTarget')
  await expect(dropTarget).toBeVisible()

  // act
  await explorer.dispatchEvent('dragleave', { bubbles: true } as any)
  await Command.execute('Timeout.sleep', 100)

  // assert
  await expect(dropTarget).toBeHidden()
}
