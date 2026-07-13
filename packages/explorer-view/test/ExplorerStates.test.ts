import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import * as GetVisibleExplorerItems from '../src/parts/GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

test('wrapListItemCommand recomputes visible items when focus changes', async () => {
  const uid = 9001
  const items = [
    {
      depth: 1,
      name: 'a.txt',
      path: '/a.txt',
      selected: false,
      type: DirentType.File,
    },
    {
      depth: 1,
      name: 'b.txt',
      path: '/b.txt',
      selected: false,
      type: DirentType.File,
    },
  ]
  const fileIconCache = {
    '/a.txt': '',
    '/b.txt': '',
  }
  const state = {
    ...createDefaultState(),
    fileIconCache,
    focusedIndex: 0,
    height: 100,
    icons: ['', ''],
    itemHeight: 20,
    items,
    maxLineY: 2,
    minLineY: 0,
    visibleExplorerItems: GetVisibleExplorerItems.getVisibleExplorerItems(items, 0, 2, 0, -1, '', ['', ''], false, [], '', [], [], []),
  }
  const wrapped = ExplorerStates.wrapListItemCommand(async () => {
    return {
      ...state,
      focusedIndex: 1,
    }
  })

  ExplorerStates.set(uid, state, state)
  await wrapped(uid)

  const { newState } = ExplorerStates.get(uid)
  expect(newState.focusedIndex).toBe(1)
  expect(newState.visibleExplorerItems[0].id).toBeUndefined()
  expect(newState.visibleExplorerItems[1].id).toBe('TreeItemActive')
})

test('wrapListItemCommand runs concurrent commands in invocation order', async () => {
  const uid = 9002
  const state = createDefaultState()
  const firstCommandStarted = Promise.withResolvers<void>()
  const releaseFirstCommand = Promise.withResolvers<void>()
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState, value: string) => {
    if (value === 'first') {
      firstCommandStarted.resolve()
      await releaseFirstCommand.promise
    }
    return {
      ...currentState,
      editingValue: value,
    }
  })

  ExplorerStates.set(uid, state, state)
  const firstCommand = wrapped(uid, 'first')
  await firstCommandStarted.promise
  const secondCommand = wrapped(uid, 'second')
  releaseFirstCommand.resolve()
  await Promise.all([firstCommand, secondCommand])

  const { newState } = ExplorerStates.get(uid)
  expect(newState.editingValue).toBe('second')
})

test('wrapListItemCommand continues after a command fails', async () => {
  const uid = 9003
  const state = createDefaultState()
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState, value: string) => {
    if (value === 'fail') {
      throw new Error('Failed command')
    }
    return {
      ...currentState,
      editingValue: value,
    }
  })

  ExplorerStates.set(uid, state, state)
  await expect(wrapped(uid, 'fail')).rejects.toThrow(new Error('Failed command'))
  await wrapped(uid, 'next')

  const { newState } = ExplorerStates.get(uid)
  expect(newState.editingValue).toBe('next')
})
