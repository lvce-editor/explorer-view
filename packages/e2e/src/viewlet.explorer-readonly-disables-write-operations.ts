import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-readonly-disables-write-operations'

export const test: Test = async ({ expect, Explorer, Extension, FileSystem, Locator, Workspace }) => {
  // arrange
  const uri = import.meta.resolve('../fixtures/sample.file-system-provider-readonly')
  await Extension.addWebExtension(uri)
  const prefix = 'extension-host://readonly://'
  await FileSystem.writeFile(`${prefix}/file.txt`, 'content')
  await Workspace.setPath(`${prefix}/`)

  // assert
  const newFileButton = Locator('button[name="NewFile"]')
  const newFolderButton = Locator('button[name="NewFolder"]')
  await expect(newFileButton).toHaveCount(0)
  await expect(newFolderButton).toHaveCount(0)

  // act
  await Explorer.newFile()
  await Explorer.newFolder()
  await Explorer.renameDirent()
  await Explorer.removeDirent()

  // assert
  const input = Locator('.Explorer input')
  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(input).toHaveCount(0)
  await expect(file).toBeVisible()

  // act
  await Explorer.openContextMenu(0)

  // assert
  const disabledMenuItems = Locator('.MenuItem[aria-disabled="true"]')
  await expect(disabledMenuItems).toHaveCount(4)
}
