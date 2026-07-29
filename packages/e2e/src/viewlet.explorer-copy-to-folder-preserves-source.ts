import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-to-folder-preserves-source'

export const test: Test = async ({ ClipBoard, Explorer, FileSystem, Workspace }) => {
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  const sourcePath = `${tmpDir}/source/file.txt`
  const targetPath = `${tmpDir}/target/file.txt`
  await FileSystem.mkdir(`${tmpDir}/source`)
  await FileSystem.writeFile(sourcePath, 'copy me')
  await FileSystem.mkdir(`${tmpDir}/target`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  await Explorer.handleCopy()
  await Explorer.focusIndex(2)
  await Explorer.handlePaste()

  await FileSystem.shouldHaveFile(sourcePath, 'copy me')
  await FileSystem.shouldHaveFile(targetPath, 'copy me')
}
