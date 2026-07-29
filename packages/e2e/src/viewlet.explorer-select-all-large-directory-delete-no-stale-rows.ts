import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-all-large-directory-delete-no-stale-rows'

export const skip = 1

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 500 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(3, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.selectAll()
  await Explorer.removeDirent()

  // assert
  const staleRow = Locator('.TreeItem')
  await expect(staleRow).toHaveCount(0)
}
