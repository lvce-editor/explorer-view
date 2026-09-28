import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-last-item-updates-scrollbar'

const itemCount = 100
const nonZeroVerticalTranslation = /^0px [1-9]\d*px$/

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFiles(
    Array.from({ length: itemCount }, (_, index) => ({
      content: '',
      uri: `${tmpDir}/file-${index.toString().padStart(3, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)
  await Explorer.setDeltaY(1)
  await Explorer.setDeltaY(0)
  const scrollBarThumb = Locator('.Explorer .ScrollBarThumb')
  await expect(scrollBarThumb).toBeVisible()

  // act
  await Explorer.reveal(`${tmpDir}/file-099.txt`)

  // assert
  await expect(scrollBarThumb).toHaveCSS('translate', nonZeroVerticalTranslation as unknown as string)
}
