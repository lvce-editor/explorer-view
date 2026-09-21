import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-pointer-multiple-selection'

export const test: Test = async ({ DragAndDrop, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/destination`)
  await FileSystem.mkdir(`${tmpDir}/source-folder`)
  await FileSystem.setFiles([
    { content: 'nested', uri: `${tmpDir}/source-folder/nested.txt` },
    { content: 'source', uri: `${tmpDir}/source.txt` },
    { content: 'second', uri: `${tmpDir}/second.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)
  await Explorer.toggleIndividualSelection(2)
  await Explorer.toggleIndividualSelection(3)

  const list = Locator('.Explorer .ListItems')
  await list.dispatchEvent('pointerdown', { bubbles: true, button: 0, clientX: 300, clientY: 100 } as any)
  await list.dispatchEvent('dragstart', { bubbles: true } as any)
  await Explorer.handleDragOverIndex(0)
  await DragAndDrop.shouldHaveDragData([
    { data: `${tmpDir}/source-folder/\n${tmpDir}/second.txt\n${tmpDir}/source.txt`, type: 'text/uri-list' },
    { data: `${tmpDir}/source-folder/\n${tmpDir}/second.txt\n${tmpDir}/source.txt`, type: 'text/plain' },
  ])

  const dropId = await DragAndDrop.createDropSessionFromDragData()
  await Explorer.handleDrop(300, 0, dropId)

  for (const file of ['source.txt', 'second.txt']) {
    const moved = Locator(`.TreeItem[title="${tmpDir}/destination/${file}"]`)
    await expect(moved).toBeVisible()
    await FileSystem.shouldHaveFile(`${tmpDir}/destination/${file}`, file === 'source.txt' ? 'source' : 'second')
  }
  await Explorer.expandRecursively()
  const movedNested = Locator(`.TreeItem[title="${tmpDir}/destination/source-folder/nested.txt"]`)
  await expect(movedNested).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/destination/source-folder/nested.txt`, 'nested')
}
