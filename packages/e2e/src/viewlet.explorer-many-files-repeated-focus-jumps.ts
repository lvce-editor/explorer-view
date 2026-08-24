import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-many-files-repeated-focus-jumps'

const totalFiles = 2000

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles(
    Array.from({ length: totalFiles }, (_, index) => ({
      content: `content ${index}`,
      uri: `${tmpDir}/file-${index.toString().padStart(4, '0')}.txt`,
    })),
  )
  await Workspace.setPath(tmpDir)

  const indices = [0, 250, 1999, 125, 1500, 1, 1998]

  for (const index of indices) {
    const fileName = `file-${index.toString().padStart(4, '0')}.txt`
    const file = Locator('.TreeItem', { hasText: fileName })
    await Explorer.focusIndex(index)
    await expect(file).toBeVisible()
    await expect(file).toHaveId('TreeItemActive')
  }
}
