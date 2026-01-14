import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-file-into-folder'

export const test: Test = async ({ Explorer, FileSystem, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/new`)
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(1)

  // act
  await Explorer.handleDragOverIndex(1)
  // await Explorer.handleDrop()

  // TODO drop file into folder and verify it is moved
}
