import { expect, jest, test } from '@jest/globals'
import { WhenExpression } from '@lvce-editor/constants'
import { createMockRpc } from '@lvce-editor/rpc'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DiffType from '../src/parts/DiffType/DiffType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

test('render2 - returns renderer commands when no direct renderer is connected', async () => {
  const uid = 3
  const oldState = { ...createDefaultState(), uid }
  const newState = {
    ...oldState,
    items: [...oldState.items],
  }
  ExplorerStates.set(uid, oldState, newState)

  await expect(Render2.render2(uid, [])).resolves.toEqual([['Viewlet.setPatches', uid, []]])
})

test('render2 - preserves state changes that were not scheduled for rendering', async () => {
  const uid = 4
  const renderedState = { ...createDefaultState(), focusWord: 'b', uid }
  const currentState = { ...renderedState, focusWord: '' }
  ExplorerStates.set(uid, renderedState, currentState, renderedState)

  await Render2.render2(uid, [])

  expect(ExplorerStates.get(uid)).toEqual({
    newState: currentState,
    oldState: renderedState,
    scheduledState: renderedState,
  })
})

test('render2 - queues renderer commands and returns a lightweight commit marker', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 17)
  RendererProcess.set(
    createMockRpc({
      commandMap: {
        'Viewlet.queueCommands': queueCommands,
      },
    }),
  )
  const uid = 1
  const staleDiffResult = [DiffType.RenderFocus]
  const oldState = createDefaultState()
  const newState = {
    ...oldState,
    items: [...oldState.items],
  }
  ExplorerStates.set(uid, oldState, newState)
  const result = await Render2.render2(uid, staleDiffResult)

  expect(queueCommands).toHaveBeenCalledWith(uid, [['Viewlet.setPatches', 1, []]])
  expect(result).toEqual([['Viewlet.commitPending', uid, 17]])
})

test('render2 - leaves focus context management with the renderer worker', async () => {
  const queueCommands = jest.fn((_uid: number, _commands: readonly unknown[]) => 23)
  RendererProcess.set(createMockRpc({ commandMap: { 'Viewlet.queueCommands': queueCommands } }))
  const uid = 2
  const oldState = { ...createDefaultState(), uid }
  const newState = { ...oldState, focus: FocusId.List }
  ExplorerStates.set(uid, oldState, newState)

  const result = await Render2.render2(uid, [])

  expect(queueCommands).toHaveBeenCalledWith(uid, [['Viewlet.focusSelector', uid, '.ListItems']])
  expect(result).toEqual([
    ['Viewlet.commitPending', uid, 23],
    ['Viewlet.setFocusContext', uid, WhenExpression.FocusExplorer],
  ])
})
