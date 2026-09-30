import type { Test } from '@lvce-editor/test-worker'

export const name = 'viewlet.explorer-scrollbar-preserves-tree'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 23 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(2, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  const lastFile = Locator('.Explorer .TreeItem[aria-label="file-22.txt"]')
  const scrollBar = Locator('.Explorer .ScrollBar')

  // Both heights render all 23 rows; only the scrollbar child changes.
  await Explorer.handleResize({ height: 506, width: 240 })
  await expect(lastFile).toBeVisible()
  await expect(scrollBar).toBeHidden()

  await Explorer.handleResize({ height: 505, width: 240 })
  await expect(scrollBar).toBeVisible()
  await expect(lastFile).toBeVisible()

  await Explorer.handleResize({ height: 506, width: 240 })
  await expect(scrollBar).toBeHidden()
  await expect(lastFile).toBeVisible()
}
