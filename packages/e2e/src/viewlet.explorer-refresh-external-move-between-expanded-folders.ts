import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-refresh-external-move-between-expanded-folders'

export const skip = 1

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.mkdir(`${tmpDir}/b`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Command.execute('FileSystem.rename', `${tmpDir}/a/file.txt`, `${tmpDir}/b/file.txt`)
  await Explorer.refresh()

  // assert
  const sourceFile = Locator(`.TreeItem[title="${tmpDir}/a/file.txt"]`)
  const targetFile = Locator(`.TreeItem[title="${tmpDir}/b/file.txt"]`)
  await expect(sourceFile).toBeHidden()
  await expect(targetFile).toBeVisible()
  await expect(targetFile).toHaveAttribute('aria-level', '2')
}
