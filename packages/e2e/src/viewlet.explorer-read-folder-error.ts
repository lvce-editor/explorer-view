import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-read-folder-error'

export const skip = 1

export const test: Test = async ({ Command, Extension, FileSystem, SideBar, Workspace }) => {
  // arrange
  const uri = import.meta.resolve('../fixtures/sample-file-system-provider-read-folder-error')
  await Extension.addWebExtension(uri)
  const prefix = 'extension-host://xyz://'
  await FileSystem.writeFile(`${prefix}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${prefix}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${prefix}/file3.txt`, 'content 3')
  await Workspace.setPath(`${prefix}/`)
  await SideBar.hide()

  // act
  await Command.execute('Layout.showSideBar')

  // assert
  // TODO verify error message is displayed
}
