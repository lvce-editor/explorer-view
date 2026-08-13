import { beforeEach, expect, jest, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererProcess } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../src/parts/ExplorerState/ExplorerState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Diff2 from '../src/parts/Diff2/Diff2.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import { handlePointerDown } from '../src/parts/HandlePointerDown/HandlePointerDown.ts'
import { handlePointerUp } from '../src/parts/HandlePointerUp/HandlePointerUp.ts'
import * as MouseEventType from '../src/parts/MouseEventType/MouseEventType.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'

const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 1)

beforeEach(() => {
  queueCommands.mockClear()
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
})

test('pointer down renders drag data for the pointed explorer item', async () => {
  const uid = 42
  const oldState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [{ depth: 0, name: 'file.txt', path: '/workspace/file.txt', selected: false, type: DirentType.File }],
    uid,
  }
  ExplorerStates.set(uid, oldState, oldState)

  const newState = handlePointerDown(oldState, MouseEventType.LeftClick, 0, 0)
  ExplorerStates.set(uid, oldState, newState)
  const diffResult = Diff2.diff2(uid)
  await Render2.render2(uid, diffResult)

  expect(queueCommands).toHaveBeenCalledWith(uid, [
    [
      'Viewlet.setDragData',
      uid,
      {
        items: [
          { data: 'file:///workspace/file.txt', type: 'text/uri-list' },
          { data: 'file:///workspace/file.txt', type: 'text/plain' },
        ],
        label: 'file.txt',
      },
    ],
  ])
})

test('pointer up rearms drag data rendering for repeated drags', async () => {
  const uid = 43
  const initialState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'first.txt', path: '/workspace/first.txt', selected: false, type: DirentType.File },
      { depth: 0, name: 'second.txt', path: '/workspace/second.txt', selected: false, type: DirentType.File },
    ],
    uid,
  }
  ExplorerStates.set(uid, initialState, initialState)

  const pointerDownState = handlePointerDown(initialState, MouseEventType.LeftClick, 0, initialState.itemHeight)
  ExplorerStates.set(uid, initialState, pointerDownState)
  await Render2.render2(uid, Diff2.diff2(uid))

  const pointerUpState = handlePointerUp(pointerDownState)
  ExplorerStates.set(uid, pointerDownState, pointerUpState)
  await Render2.render2(uid, Diff2.diff2(uid))

  const secondPointerDownState = handlePointerDown(pointerUpState, MouseEventType.LeftClick, 0, initialState.itemHeight)
  ExplorerStates.set(uid, pointerUpState, secondPointerDownState)
  await Render2.render2(uid, Diff2.diff2(uid))

  const expectedCommand = [
    'Viewlet.setDragData',
    uid,
    {
      items: [
        { data: 'file:///workspace/second.txt', type: 'text/uri-list' },
        { data: 'file:///workspace/second.txt', type: 'text/plain' },
      ],
      label: 'second.txt',
    },
  ]
  expect(queueCommands).toHaveBeenNthCalledWith(1, uid, [expectedCommand])
  expect(queueCommands).toHaveBeenNthCalledWith(2, uid, [])
  expect(queueCommands).toHaveBeenNthCalledWith(3, uid, [expectedCommand])
})

test('pointer down on a selected item renders drag data for the full effective selection', async () => {
  const uid = 44
  const oldState: ExplorerState = {
    ...createDefaultState(),
    focusedIndex: 0,
    items: [
      { depth: 0, name: 'focused.txt', path: '/workspace/focused.txt', selected: false, type: DirentType.File },
      { depth: 0, name: 'selected.txt', path: '/workspace/selected.txt', selected: true, type: DirentType.File },
    ],
    uid,
  }
  ExplorerStates.set(uid, oldState, oldState)

  const newState = handlePointerDown(oldState, MouseEventType.LeftClick, 0, oldState.itemHeight)
  ExplorerStates.set(uid, oldState, newState)

  await Render2.render2(uid, Diff2.diff2(uid))

  expect(queueCommands).toHaveBeenCalledWith(uid, [
    [
      'Viewlet.setDragData',
      uid,
      {
        items: [
          { data: 'file:///workspace/focused.txt\nfile:///workspace/selected.txt', type: 'text/uri-list' },
          { data: 'file:///workspace/focused.txt\nfile:///workspace/selected.txt', type: 'text/plain' },
        ],
        label: '2',
      },
    ],
  ])
})
