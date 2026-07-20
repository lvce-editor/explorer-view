import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-arrow-right-nested-expanded-folder-focuses-first-child'

export const test: Test = async ({ Command, expect, Explorer, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/parent/child`)
  await FileSystem.writeFile(`${tmpDir}/parent/child/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Command.execute('Explorer.handleArrowRight')
  await Command.execute('Explorer.handleArrowRight')
  await Command.execute('Explorer.handleArrowRight')

  await Command.execute('Explorer.handleArrowRight')

  const file = Locator('.TreeItem[aria-label="file.txt"]')
  await expect(file).toHaveId('TreeItemActive')
}
