import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-scrollbar-reverses-at-bottom'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 100 }, (_, index) => ({ content: '', uri: `${tmpDir}/file-${String(index).padStart(3, '0')}.txt` })),
  )
  await Workspace.setUri(tmpDir)
  const thumb = Locator('.Explorer .ScrollBarThumb')
  await expect(thumb).toBeVisible()
  await Explorer.handleResize({ height: 499, width: 1184 })
}
