import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-collapse-all-while-scrolled'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const nestedPath = Array.from({ length: 40 }, (_, index) => `folder-${index.toString().padStart(2, '0')}`).join('/')
  await FileSystem.mkdir(`${tmpDir}/${nestedPath}`)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  const treeItems = Locator('.TreeItem')
  const firstTreeItem = Locator('.TreeItem', { hasText: 'folder-00' })
  const list = Locator('.ListItems')
  await list.dispatchEvent('wheel', {
    bubbles: true,
    deltaMode: 0,
    deltaY: 500,
  } as unknown as string)
  await Explorer.refresh()
  await expect(firstTreeItem).toBeHidden()

  // act
  await Explorer.collapseAll()

  // assert
  await expect(treeItems).toHaveCount(1)
  await expect(firstTreeItem).toHaveText('folder-00')
}
