import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-context-menu-open-in-integrated-terminal'

export const skip = 1

export const test: Test = async ({ Command, ContextMenu, expect, Explorer, FileSystem, Locator, Settings, Workspace }) => {
  // arrange
  await Settings.update({
    'terminal.backend': 'mock',
  })
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/file.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  // act
  await Explorer.openContextMenu(1)
  await ContextMenu.selectItem('Open in integrated Terminal')

  // assert
  const panel = Locator('.Panel')
  const terminal = Locator('.XtermTerminal')
  const terminalInput = terminal.locator('.xterm-helper-textarea')
  await expect(panel).toBeVisible()
  await expect(terminal).toBeVisible()
  await expect(terminalInput).toBeFocused()
  const states = await Command.execute('Viewlet.getAllStates')
  const terminalState = Object.values(states).find((state: any) => state.cwd === 'memfs:///workspace/folder')
  if (!terminalState) {
    throw new Error('Expected a terminal in memfs:///workspace/folder')
  }
}
