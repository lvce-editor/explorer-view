import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-file-error'

export const skip = 1

// @ts-ignore
export const test: Test = async ({ Dialog, Extension, FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  // @ts-ignore
  await Dialog.mockConfirm(() => {
    return true
  })
  const uri = new URL('../fixtures/sample.file-system-provider-delete-file-error', import.meta.url).toString()
  await Extension.addWebExtension(uri)
  const prefix = 'extension-host://xyz://'
  await FileSystem.writeFile(`${prefix}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${prefix}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${prefix}/file3.txt`, 'content 3')
  await Workspace.setPath(prefix)

  // act
  await Explorer.focusFirst()
  await Explorer.removeDirent()

  // assert
  const file1 = Locator('text=file1.txt')
  await expect(file1).toBeHidden()
}
