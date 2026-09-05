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
  const stateJson = JSON.stringify(state)
  const editedState = JSON.parse(stateJson)
  editedState.visibleExplorerItems.splice(1, 1)
  await Command.execute('ComponentState.setState', explorer.uid, editedState)
  await expect(rows).toHaveCount(2)
  const firstLabel = Locator('.Explorer .Label').nth(0)
  const secondLabel = Locator('.Explorer .Label').nth(1)
  const removedRow = Locator('.Explorer .TreeItem', { hasText: 'b.txt' })
  await expect(firstLabel).toHaveText('a.txt')
  await expect(secondLabel).toHaveText('c.txt')
  await expect(removedRow).toBeHidden()

  editedState.visibleExplorerItems = []
  await Command.execute('ComponentState.setState', explorer.uid, editedState)
  await expect(rows).toHaveCount(0)

  await Command.execute('ComponentState.setState', explorer.uid, state)
  await expect(rows).toHaveCount(3)
  await expect(secondLabel).toHaveText('b.txt')
}
