import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-expand-scrolled'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Promise.all(Array.from({ length: 100 }, (_, index) => FileSystem.mkdir(`${tmpDir}/folder-${index.toString().padStart(2, '0')}`)))
  await FileSystem.writeFiles(
    Array.from({ length: 100 }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/folder-${index.toString().padStart(2, '0')}/child-${index.toString().padStart(2, '0')}.txt`,
    })),
  )
  await Workspace.setUri(tmpDir)
  const bottomFolder = Locator('.TreeItem[aria-label="folder-98"]')
  const expandedFolder = Locator('.TreeItem[aria-expanded="true"]')
  const childItems = Locator('.TreeItem[aria-label^="child-"]')

  // act
  await Explorer.focusFirst()
  await Explorer.setDeltaY(500)

  // assert
  await expect(expandedFolder).toHaveCount(0)

  // act: click a visible folder through the pointer-coordinate command path
  await Explorer.handleClickAt(false, 0, false, false, 300, 100)

  // assert
  await expect(expandedFolder).toHaveCount(1)
  await expect(childItems).toHaveCount(1)

  // act: clicking the same visible row collapses it again
  await Explorer.handleClickAt(false, 0, false, false, 300, 100)

  // assert
  await expect(expandedFolder).toHaveCount(0)
  await expect(childItems).toHaveCount(0)

  // act: activate the last visible folder after a keyboard scroll
  await Explorer.focusIndex(98)
  await Explorer.clickCurrent()

  // assert
  await expect(bottomFolder).toHaveAttribute('aria-expanded', 'true')
}
