import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-autoscroll-long-list'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/target`)
  await FileSystem.writeFiles(
    Array.from({ length: 80 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(2, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  const opfsRoot = await navigator.storage.getDirectory()
  const fileHandle = await opfsRoot.getFileHandle('file-79.txt', { create: true })

  // act
  await Explorer.focusIndex(80)
  await Explorer.handleDragOverIndex(0)
  await Explorer.handleDropIndex([fileHandle], [], [], 0)
  await Explorer.focusIndex(0)

  // assert
  const target = Locator('.TreeItem[aria-label="target"]')
  const moved = Locator(`.TreeItem[title="${tmpDir}/target/file-79.txt"]`)
  await expect(target).toHaveAttribute('aria-expanded', 'true')
  await expect(moved).toBeVisible()
}
