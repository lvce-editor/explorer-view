import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-file-error'

export const skip = 1

export const test: Test = async ({ Dialog, expect: _expect, Explorer, Extension, FileSystem, Locator: _Locator, Workspace }) => {
  // arrange
  // @ts-ignore
  let _message: string = ''
  // @ts-ignore
  await Dialog.mockConfirm((message: string) => {
    _message = message
    return true
  })
  const uri = import.meta.resolve('../fixtures/sample.file-system-provider-delete-file-error')
  await Extension.addWebExtension(uri)
  const prefix = 'extension-host://xyz://'
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${prefix}/file1.txt` },
    { content: 'content 2', uri: `${prefix}/file2.txt` },
    { content: 'content 3', uri: `${prefix}/file3.txt` },
  ])
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
