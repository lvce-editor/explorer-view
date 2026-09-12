import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-scrollbar-stays-in-track'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: 100 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(3, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  const thumb = Locator('.Explorer .ScrollBarThumb')
  const list = Locator('.Explorer .ListItems')

  for (let index = 0; index < 3; index++) {
    await list.dispatchEvent('wheel', { bubbles: true, deltaMode: 0, deltaY: 10000 } as unknown as string)
    await Explorer.refresh()
    await expect(Locator('.TreeItem', { hasText: 'file-099.txt' })).toBeVisible()
    await expect(thumb).toBeVisible()
    await expect(thumb).toHaveCSS('translate', /^0px [1-9]\d*px$/ as unknown as string)
    // The shared thumb style must not apply the scroll offset a second time.
    await expect(thumb).toHaveCSS('top', '0px')
  }
}
