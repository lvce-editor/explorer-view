import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-non-empty-folder-cancel'

export const test: Test = async ({ Dialog, Explorer, FileSystem, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const folderPath = `${tmpDir}/fixture`
  const filePath = `${folderPath}/important.txt`
  await FileSystem.mkdir(folderPath)
  await FileSystem.writeFile(filePath, 'important')
  let confirmMessage = ''
  await Dialog.mockConfirm((...args: readonly unknown[]) => {
    confirmMessage = String(args[0])
    return false
  })
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.removeDirent()

  // assert
  if (confirmMessage !== `Are you sure you want to delete "${folderPath}"?`) {
    throw new Error(`unexpected confirm message: ${confirmMessage}`)
  }
  await FileSystem.shouldHaveFile(filePath, 'important')
}
