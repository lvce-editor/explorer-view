import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-handle-drag-leave'

export const test: Test = async ({ expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)

  // act
  const explorer = Locator('.Explorer .ListItems')
  await explorer.dispatchEvent('dragover', { bubbles: true, clientX: 5000, clientY: 5000 } as any)

  // assert
  const dropTarget = Locator('.Explorer .ListItems.DropTarget')
  await expect(dropTarget).toBeVisible()

  // act
  await explorer.dispatchEvent('dragleave', { bubbles: true } as any)

  // assert
  await expect(dropTarget).toBeHidden()
}
