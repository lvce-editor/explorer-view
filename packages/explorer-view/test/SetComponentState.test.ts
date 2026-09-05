import { expect, test } from '@jest/globals'
import { ViewletCommand } from '@lvce-editor/constants'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { getVisibleExplorerItems } from '../src/parts/GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import { render2 } from '../src/parts/Render2/Render2.ts'
import { setComponentState } from '../src/parts/SetComponentState/SetComponentState.ts'

const createState = () => {
  const items = ['a.txt', 'b.txt', 'c.txt'].map((name) => ({ depth: 0, name, path: `/${name}`, selected: false, type: DirentType.File }))
  return {
    ...createDefaultState(),
    fileIconCache: { '/a.txt': '', '/b.txt': '', '/c.txt': '' },
    items,
    maxLineY: 3,
    visibleExplorerItems: getVisibleExplorerItems(items, 0, 3, 0, -1, '', ['', '', ''], true, [], '', [], [], []),
  }
}

test.each([
  ['first', 0],
  ['middle', 1],
  ['last', 2],
] as const)('setComponentState preserves removal of the %s visible item from JSON', async (_name, index) => {
  const state = createState()
  const { uid } = state
  ExplorerStates.set(uid, state, state)
  const editedState = JSON.parse(JSON.stringify(state))
  const [removed] = editedState.visibleExplorerItems.splice(index, 1)
  await setComponentState(uid, editedState)
  expect(ExplorerStates.get(uid).scheduledState.visibleExplorerItems).toEqual(editedState.visibleExplorerItems)
  const commands = await render2(uid, [])
  const domCommand = commands.find((command) => command[0] === ViewletCommand.SetDom2)
  expect(domCommand).toBeDefined()
  expect(domCommand[2]).not.toContainEqual(expect.objectContaining({ text: removed.name }))
  for (const item of editedState.visibleExplorerItems) {
    expect(domCommand[2]).toContainEqual(expect.objectContaining({ text: item.name }))
  }
})

test('setComponentState preserves clearing and restoring visible items from JSON', async () => {
  const state = createState()
  const { uid } = state
  ExplorerStates.set(uid, state, state)
  const editedState = JSON.parse(JSON.stringify(state))
  editedState.visibleExplorerItems = []
  await setComponentState(uid, editedState)
  expect(ExplorerStates.get(uid).scheduledState.visibleExplorerItems).toEqual([])
  await render2(uid, [])
  await setComponentState(uid, JSON.parse(JSON.stringify(state)))
  expect(ExplorerStates.get(uid).scheduledState.visibleExplorerItems).toEqual(state.visibleExplorerItems)
  const commands = await render2(uid, [])
  expect(commands[0][0]).toBe(ViewletCommand.SetDom2)
})

test('setComponentState keeps incremental rendering for a visible label edit', async () => {
  const state = createState()
  const { uid } = state
  ExplorerStates.set(uid, state, state)
  const editedState = JSON.parse(JSON.stringify(state))
  editedState.visibleExplorerItems[0].name = 'renamed.txt'
  await setComponentState(uid, editedState)
  expect(ExplorerStates.get(uid).scheduledState.visibleExplorerItems[0].name).toBe('renamed.txt')
  const commands = await render2(uid, [])
  expect(commands[0][0]).toBe(ViewletCommand.SetPatches)
  expect(commands[0][2]).toContainEqual(expect.objectContaining({ value: 'renamed.txt' }))
})

test('setComponentState still derives visible items when only focusedIndex changes', async () => {
  const state = createState()
  const { uid } = state
  ExplorerStates.set(uid, state, state)
  const editedState = JSON.parse(JSON.stringify(state))
  editedState.focusedIndex = 1
  await setComponentState(uid, editedState)
  const { scheduledState } = ExplorerStates.get(uid)
  expect(scheduledState.visibleExplorerItems[0].id).toBeUndefined()
  expect(scheduledState.visibleExplorerItems[1].id).toBe('TreeItemActive')
})

test('setComponentState rejects a changed uid without changing registered state', async () => {
  const state = createState()
  ExplorerStates.set(state.uid, state, state)
  await expect(setComponentState(state.uid, { ...state, uid: 999 })).rejects.toThrow('Explorer state uid must remain 1')
  expect(ExplorerStates.get(state.uid).newState).toBe(state)
})
