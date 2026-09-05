import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.explorer-live-state-visible-items'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'a', uri: `${tmpDir}/a.txt` },
    { content: 'b', uri: `${tmpDir}/b.txt` },
    { content: 'c', uri: `${tmpDir}/c.txt` },
  ])
  await Workspace.setPath(tmpDir)
  const rows = Locator('.Explorer .TreeItem')
  await expect(rows).toHaveCount(3)
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const explorer = components.find((component) => component.moduleId === 'Explorer')
  if (!explorer) {
    throw new Error('Explorer component not found')
  }
  const state = await Command.execute('ComponentState.getState', explorer.uid)
  const editedState = JSON.parse(JSON.stringify(state))
  editedState.visibleExplorerItems.splice(1, 1)
  await Command.execute('ComponentState.setState', explorer.uid, editedState)
  await expect(rows).toHaveCount(2)
  await expect(Locator('.Explorer .Label').nth(0)).toHaveText('a.txt')
  await expect(Locator('.Explorer .Label').nth(1)).toHaveText('c.txt')
  await expect(Locator('.Explorer .TreeItem', { hasText: 'b.txt' })).toBeHidden()

  editedState.visibleExplorerItems = []
  await Command.execute('ComponentState.setState', explorer.uid, editedState)
  await expect(rows).toHaveCount(0)

  await Command.execute('ComponentState.setState', explorer.uid, state)
  await expect(rows).toHaveCount(3)
  await expect(Locator('.Explorer .Label').nth(1)).toHaveText('b.txt')
}
