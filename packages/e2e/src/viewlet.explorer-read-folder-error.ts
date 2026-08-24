import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-read-folder-error'

export const skip = 1

export const test: Test = async ({ expect, Extension, FileSystem, Layout, Locator, SideBar, Workspace }) => {
  // arrange
  const uri = import.meta.resolve('../fixtures/sample-file-system-provider-read-folder-error')
  await Extension.addWebExtension(uri)
  const prefix = 'extension-host://xyz://'
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${prefix}/file1.txt` },
    { content: 'content 2', uri: `${prefix}/file2.txt` },
    { content: 'content 3', uri: `${prefix}/file3.txt` },
  ])
  await Workspace.setPath(`${prefix}/`)
  await SideBar.hide()

  // act
  await Layout.showSideBar()

  // assert
  const error = Locator('.Explorer .WelcomeMessage')
  await expect(error).toBeVisible()
  await expect(error).toHaveText(`Could not open folder due to Failed to execute file system provider: FileNotFoundError: File not found.`)
}
