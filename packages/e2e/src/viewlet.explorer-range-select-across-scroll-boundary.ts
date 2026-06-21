import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-range-select-across-scroll-boundary'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  for (let i = 0; i < 120; i++) {
    await FileSystem.writeFile(`${tmpDir}/file-${i.toString().padStart(3, '0')}.txt`, '')
  }
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(5)

  // act
  await Explorer.handleClickAt(false, 5, false, false, 300, 100)
  await Explorer.focusIndex(90)
  await Explorer.handleClickAt(false, 90, true, false, 300, 100)

  // assert
  const first = Locator('.TreeItem[aria-label="file-005.txt"]')
  const middle = Locator('.TreeItem[aria-label="file-050.txt"]')
  const last = Locator('.TreeItem[aria-label="file-090.txt"]')
  await expect(first).toHaveAttribute('aria-selected', 'true')
  await expect(middle).toHaveAttribute('aria-selected', 'true')
  await expect(last).toHaveAttribute('aria-selected', 'true')
}
