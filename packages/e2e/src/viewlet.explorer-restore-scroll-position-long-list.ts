import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-restore-scroll-position-long-list'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 200 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(3, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(150)
  const savedState = await Explorer.saveState()

  // act
  await Workspace.setPath('')
  await Workspace.setPath(tmpDir)
  await Explorer.restoreState(savedState)

  // assert
  const restoredFile = Locator('.TreeItem[aria-label="file-150.txt"]')
  await expect(restoredFile).toBeVisible()
  await expect(restoredFile).toHaveId('TreeItemActive')
}
