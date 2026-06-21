import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-source-control-decoration-updates-after-create-rename-delete'

export const skip = 1

export const test: Test = async ({ Command, expect, Explorer, Extension, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'explorer.sourceControlDecorations': true,
  })
  const uri = import.meta.resolve('../fixtures/sample.source-control-decoration')
  await Extension.addWebExtension(uri)
  const tmpDir = 'extension-host://xyz://'
  await FileSystem.writeFile(`${tmpDir}/tracked.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/.gitignore`, 'ignored.txt')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFile()
  await Explorer.updateEditingValue('ignored.txt')
  await Explorer.acceptEdit()
  await Command.execute('FileSystem.rename', `${tmpDir}/ignored.txt`, `${tmpDir}/ignored-renamed.txt`)
  await FileSystem.remove(`${tmpDir}/tracked.txt`)
  await Explorer.refresh()

  // assert
  const deleted = Locator('.TreeItem[aria-label="tracked.txt"]')
  const renamed = Locator('.TreeItem[aria-label="ignored-renamed.txt"]')
  await expect(deleted).toBeHidden()
  await expect(renamed).toHaveClass('decoration-ignored')
}
