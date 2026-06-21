import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-all-large-directory-delete-no-stale-rows'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  for (let i = 0; i < 500; i++) {
    await FileSystem.writeFile(`${tmpDir}/file-${i.toString().padStart(3, '0')}.txt`, '')
  }
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.selectAll()
  await Explorer.removeDirent()

  // assert
  const staleRow = Locator('.TreeItem')
  await expect(staleRow).toHaveCount(0)
}
