import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-reveal-last-item-fills-viewport'

const itemCount = 100

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
  const lastFilePath = `${tmpDir}/file-099.txt`
  const precedingFile = Locator('.TreeItem[aria-label="file-080.txt"]')
  const lastFile = Locator('.TreeItem[aria-label="file-099.txt"]')
  await expect(precedingFile).toBeHidden()
  await expect(lastFile).toBeHidden()

  // act
  await Explorer.reveal(lastFilePath)

  // assert
  await expect(precedingFile).toBeVisible()
  await expect(lastFile).toBeVisible()
  await expect(lastFile).toHaveId('TreeItemActive')
}
