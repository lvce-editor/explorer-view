import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-after-blur'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focus')
  await Explorer.focusIndex(0)

  const explorerItems = Locator('.Explorer .ListItems')
  await expect(explorerItems).toBeFocused()

  await Explorer.handleBlur()
  await Command.execute('Explorer.focus')

  await expect(explorerItems).toBeFocused()
}
