import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-unselected-file-excludes-existing-selection'

const assertDragData = async (Command: any, expectedUris: readonly string[], expectedLabel: string): Promise<void> => {
  const dragData = await Command.execute('Explorer.getDragData')
  const expectedData = expectedUris.join('\n')
  const uriList = dragData?.items?.find((item: any) => item.type === 'text/uri-list')?.data
  const plainText = dragData?.items?.find((item: any) => item.type === 'text/plain')?.data
  if (uriList !== expectedData || plainText !== expectedData || dragData?.label !== expectedLabel) {
    throw new Error(`Unexpected drag data: ${JSON.stringify(dragData)}`)
  }
}

export const test: Test = async ({ Command, Explorer, FileSystem, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'a')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'b')
  await FileSystem.writeFile(`${tmpDir}/c.txt`, 'c')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.toggleIndividualSelection(1)

  await Command.execute('Explorer.handlePointerDown', 0, 0, 105)

  await assertDragData(Command, [`${tmpDir}/c.txt`], 'c.txt')
}
