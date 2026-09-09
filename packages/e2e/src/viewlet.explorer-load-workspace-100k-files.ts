import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-load-workspace-100k-files'

const totalFiles = 100_000
const batchSize = 500

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  for (let start = 0; start < totalFiles; start += batchSize) {
    await FileSystem.writeFiles(
      Array.from({ length: Math.min(batchSize, totalFiles - start) }, (_, index) => ({
        content: '',
        uri: `${tmpDir}/file-${(start + index).toString().padStart(6, '0')}.txt`,
      })),
    )
  }

  // act
  await Workspace.setPath(tmpDir)

  // assert: loading succeeds and virtualization can reach every part of the directory.
  for (const index of [0, 50_000, 99_999]) {
    await Explorer.focusIndex(index)
    const item = Locator(`.TreeItem[aria-label="file-${index.toString().padStart(6, '0')}.txt"]`)
    await expect(item).toBeVisible()
    await expect(item).toHaveId('TreeItemActive')
    await expect(item).toHaveAttribute('aria-setsize', String(totalFiles))
  }

  // act: refreshing takes the same workspace restoration path.
  await Explorer.refresh()
  await Explorer.focusFirst()

  // assert
  const first = Locator('.TreeItem[aria-label="file-000000.txt"]')
  await expect(first).toBeVisible()
  await expect(first).toHaveId('TreeItemActive')
}
