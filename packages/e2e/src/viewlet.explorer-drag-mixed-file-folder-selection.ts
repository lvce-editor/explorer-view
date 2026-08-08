import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-mixed-file-folder-selection'

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
  await FileSystem.mkdir(`${tmpDir}/a-folder`)
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'b')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.toggleIndividualSelection(1)

  await Command.execute('Explorer.handlePointerDown', 0, 0, 85)

  await assertDragData(Command, [`${tmpDir}/a-folder`, `${tmpDir}/b.txt`], '2')
}
