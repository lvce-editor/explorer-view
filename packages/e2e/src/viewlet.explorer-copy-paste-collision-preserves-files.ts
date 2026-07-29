import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-paste-collision-preserves-files'

export const test: Test = async ({ ClipBoard, Explorer, FileSystem, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const sourcePath = `${tmpDir}/source2.txt`
  const existingTargetPath = `${tmpDir}/target/source2.txt`
  const copiedPath = `${tmpDir}/target/source2 copy.txt`
  await FileSystem.writeFile(sourcePath, 'source two')
  await FileSystem.mkdir(`${tmpDir}/target`)
  await FileSystem.writeFile(existingTargetPath, 'destination two')
  await Workspace.setPath(tmpDir)

  await Explorer.focusIndex(1)
  await Explorer.handleCopy()
  await Explorer.focusIndex(0)
  await Explorer.handlePaste()

  const sourceContent = await FileSystem.readFile(sourcePath)
  const existingTargetContent = await FileSystem.readFile(existingTargetPath)
  const copiedContent = await FileSystem.readFile(copiedPath)
  if (sourceContent !== 'source two') {
    throw new Error(`Expected source file to be preserved, got ${JSON.stringify(sourceContent)}`)
  }
  if (existingTargetContent !== 'destination two') {
    throw new Error(`Expected existing destination file to be preserved, got ${JSON.stringify(existingTargetContent)}`)
  }
  if (copiedContent !== 'source two') {
    throw new Error(`Expected renamed copy to contain source content, got ${JSON.stringify(copiedContent)}`)
  }
}
