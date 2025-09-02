import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-file-error'

// @ts-ignore
export const test: Test = async ({ Dialog, Extension, FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  let _message: string = ''
  // @ts-ignore
  await Dialog.mockConfirm((message: string) => {
    _message = message
    return true
  })
  const uri = new URL('../fixtures/sample.file-system-provider-delete-file-error', import.meta.url).toString()
  await Extension.addWebExtension(uri)
  const prefix = 'extension-host://xyz://'
  await FileSystem.writeFile(`${prefix}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${prefix}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${prefix}/file3.txt`, 'content 3')
  await Workspace.setPath(prefix)
  await Explorer.focusFirst()

  // act
  await Explorer.removeDirent()

  // assert
  const expectedMessage = 'Error: Failed to execute file system provider: oops'
  if (_message !== expectedMessage) {
    throw new Error(`expected confirm message to be `)
  }
}
