import { expect, test } from '@jest/globals'
import { createMockRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as DirentType from '../src/parts/DirentType/DirentType.ts'
import * as ExplorerStates from '../src/parts/ExplorerStates/ExplorerStates.ts'
import * as FocusId from '../src/parts/FocusId/FocusId.ts'
import * as GetVisibleExplorerItems from '../src/parts/GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import * as HandleClickFile from '../src/parts/HandleClickFile/HandleClickFile.ts'
import * as InputSource from '../src/parts/InputSource/InputSource.ts'
import * as Render2 from '../src/parts/Render2/Render2.ts'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.ts'

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

test('wrapListItemCommand remains responsive while a file is opening', async () => {
  const uid = 9006
  const editorOpeningStarted = Promise.withResolvers<void>()
  const editorOpened = Promise.withResolvers<void>()
  using _mockRpc = RendererWorker.registerMockRpc({
    async 'Main.openInput'() {
      editorOpeningStarted.resolve()
      await editorOpened.promise
    },
  })
  const state = {
    ...createDefaultState(),
    items: [{ depth: 0, name: 'test.ts', path: '/test.ts', selected: false, type: DirentType.File }],
  }
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState, action: string) => {
    if (action === 'open') {
      return HandleClickFile.handleClickFile(currentState, currentState.items[0], 0)
    }
    return {
      ...currentState,
      editingValue: 'expanded',
    }
  })

  ExplorerStates.set(uid, state, state)
  let openCommandCompleted = false
  const openCommand = wrapped(uid, 'open')
  const trackOpenCommand = async (): Promise<void> => {
    await openCommand
    openCommandCompleted = true
  }
  const trackedOpenCommand = trackOpenCommand()
  await editorOpeningStarted.promise
  const nextCommand = wrapped(uid, 'expand')
  const waitForNextCommand = async (): Promise<string> => {
    await nextCommand
    return 'completed'
  }
  const nextCommandResult = await Promise.race([
    waitForNextCommand(),
    new Promise<string>((resolve) => {
      setTimeout(resolve, 100, 'blocked')
    }),
  ])
  expect(openCommandCompleted).toBe(false)
  editorOpened.resolve()
  await Promise.all([trackedOpenCommand, nextCommand])

  expect(nextCommandResult).toBe('completed')
  expect(openCommandCompleted).toBe(true)
  expect(ExplorerStates.get(uid).newState.editingValue).toBe('expanded')
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

test('wrapListItemCommand preserves user input when a pending render commits', async () => {
  RendererProcess.set(
    createMockRpc({
      commandMap: {
        'Viewlet.commitPending': () => {},
        'Viewlet.queueCommands': () => 1,
      },
    }),
  )
  const uid = 9005
  const state = {
    ...createDefaultState(),
    editingIndex: 0,
    editingSessionId: 1,
    editingValue: 'old.txt',
    focus: FocusId.Input,
    inputSource: InputSource.Script,
  }
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState) => {
    return {
      ...currentState,
      editingValue: 'new.txt',
      inputSource: InputSource.User,
    }
  })

  ExplorerStates.set(uid, state, state)
  await wrapped(uid)
  await Render2.render2(uid, [])

  const { newState } = ExplorerStates.get(uid)
  expect(newState.editingValue).toBe('new.txt')
})

test('wrapListItemCommand schedules drag state changes for rendering', async () => {
  const uid = 9011
  const state = createDefaultState()
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState) => {
    return {
      ...currentState,
      isPointerDown: true,
      pointerDownIndex: 2,
    }
  })

  ExplorerStates.set(uid, state, state)
  await wrapped(uid)

  const { scheduledState } = ExplorerStates.get(uid)
  expect(scheduledState.isPointerDown).toBe(true)
  expect(scheduledState.pointerDownIndex).toBe(2)
})

test('wrapListItemCommand schedules repeated focus requests for rendering', async () => {
  const uid = 9012
  const state = {
    ...createDefaultState(),
    focus: FocusId.List,
    focused: true,
  }
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState) => {
    return {
      ...currentState,
      version: currentState.version + 1,
    }
  })

  ExplorerStates.set(uid, state, state)
  await wrapped(uid)

  const { scheduledState } = ExplorerStates.get(uid)
  expect(scheduledState.version).toBe(2)
})

test('wrapListItemCommand schedules explorer blur for rendering', async () => {
  const uid = 9013
  const state = {
    ...createDefaultState(),
    focus: FocusId.List,
    focused: true,
  }
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState) => {
    return {
      ...currentState,
      focused: false,
    }
  })

  ExplorerStates.set(uid, state, state)
  await wrapped(uid)

  const { scheduledState } = ExplorerStates.get(uid)
  expect(scheduledState.focused).toBe(false)
})

test('wrapListItemCommandImmediate allows a callback while a queued command is running', async () => {
  const uid = 9004
  const state = createDefaultState()
  const immediate = ExplorerStates.wrapListItemCommandImmediate(async (currentState) => {
    return {
      ...currentState,
      editingValue: 'callback',
    }
  })
  const queued = ExplorerStates.wrapListItemCommand(async (currentState) => {
    await immediate(uid)
    return {
      ...currentState,
      editingValue: 'queued',
    }
  })

  ExplorerStates.set(uid, state, state)
  await queued(uid)

  const { newState } = ExplorerStates.get(uid)
  expect(newState.editingValue).toBe('queued')
})

test('wrapListItemCommand renders items before gitignore decoration reads finish', async () => {
  const uid = 9007
  const gitIgnoreRead = Promise.withResolvers<string>()
  const updateDecorations = ExplorerStates.wrapListItemCommand(ExplorerStates.updateGitIgnoredUris)
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile'() {
      return gitIgnoreRead.promise
    },
    async 'Viewlet.executeViewletCommand'(_viewletId: number, _command: string, generation: number, ignoredUris: readonly string[]) {
      await updateDecorations(uid, generation, ignoredUris)
    },
  })
  const item = { depth: 1, name: 'debug.log', path: '/workspace/debug.log', selected: false, type: DirentType.File }
  const state = {
    ...createDefaultState(),
    fileIconCache: { [item.path]: '' },
    gitIgnoreDecorations: true,
    root: '/workspace',
    uid,
  }
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState) => ({
    ...currentState,
    items: [item],
  }))

  ExplorerStates.set(uid, state, state)
  await wrapped(uid)

  expect(ExplorerStates.get(uid).newState.items).toEqual([item])
  expect(ExplorerStates.get(uid).newState.sourceControlIgnoredUris).toEqual([])
  gitIgnoreRead.resolve('*.log')
  await new Promise((resolve) => setTimeout(resolve, 150))
  expect(ExplorerStates.get(uid).newState.sourceControlIgnoredUris).toEqual(['/workspace/debug.log'])
})

test('wrapListItemCommand waits for interaction idle before applying gitignore decorations', async () => {
  const uid = 9010
  const updateDecorations = ExplorerStates.wrapListItemCommand(ExplorerStates.updateGitIgnoredUris)
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile'() {
      return '*.log'
    },
    async 'Viewlet.executeViewletCommand'(_viewletId: number, _command: string, generation: number, ignoredUris: readonly string[]) {
      await updateDecorations(uid, generation, ignoredUris)
    },
  })
  const item = { depth: 1, name: 'debug.log', path: '/workspace/debug.log', selected: false, type: DirentType.File }
  const state = {
    ...createDefaultState(),
    fileIconCache: { [item.path]: '' },
    gitIgnoreDecorations: true,
    root: '/workspace',
    uid,
  }
  const readItems = ExplorerStates.wrapListItemCommand(async (currentState) => ({
    ...currentState,
    items: [item],
  }))
  const interact = ExplorerStates.wrapListItemCommand(async (currentState) => ({
    ...currentState,
    focusedIndex: 0,
  }))

  ExplorerStates.set(uid, state, state)
  await readItems(uid)
  await new Promise((resolve) => setTimeout(resolve, 70))
  await interact(uid)
  await new Promise((resolve) => setTimeout(resolve, 50))

  expect(ExplorerStates.get(uid).newState.sourceControlIgnoredUris).toEqual([])
  await new Promise((resolve) => setTimeout(resolve, 75))
  expect(ExplorerStates.get(uid).newState.sourceControlIgnoredUris).toEqual(['/workspace/debug.log'])
})

test('wrapListItemCommand does not schedule decoration rendering when gitignore decorations are disabled', async () => {
  const uid = 9009
  let renderCount = 0
  using _mockRpc = RendererWorker.registerMockRpc({
    'Viewlet.executeViewletCommand'() {
      renderCount++
    },
  })
  const state = {
    ...createDefaultState(),
    fileIconCache: { '/file.txt': '' },
  }
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState) => ({
    ...currentState,
    items: [{ depth: 0, name: 'file.txt', path: '/file.txt', selected: false, type: DirentType.File }],
  }))

  ExplorerStates.set(uid, state, state)
  await wrapped(uid)
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(renderCount).toBe(0)
})

test('wrapListItemCommand discards stale gitignore decoration results', async () => {
  const uid = 9008
  const firstRead = Promise.withResolvers<string>()
  const secondRead = Promise.withResolvers<string>()
  let readCount = 0
  const updateDecorations = ExplorerStates.wrapListItemCommand(ExplorerStates.updateGitIgnoredUris)
  using _mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.readFile'() {
      readCount++
      if (readCount === 1) {
        return firstRead.promise
      }
      return secondRead.promise
    },
    async 'Viewlet.executeViewletCommand'(_viewletId: number, _command: string, generation: number, ignoredUris: readonly string[]) {
      await updateDecorations(uid, generation, ignoredUris)
    },
  })
  const firstItem = { depth: 1, name: 'first.log', path: '/workspace/first.log', selected: false, type: DirentType.File }
  const secondItem = { depth: 1, name: 'second.tmp', path: '/workspace/second.tmp', selected: false, type: DirentType.File }
  const state = {
    ...createDefaultState(),
    fileIconCache: { [firstItem.path]: '', [secondItem.path]: '' },
    gitIgnoreDecorations: true,
    root: '/workspace',
    uid,
  }
  const wrapped = ExplorerStates.wrapListItemCommand(async (currentState, item: typeof firstItem) => ({
    ...currentState,
    items: [item],
  }))

  ExplorerStates.set(uid, state, state)
  await wrapped(uid, firstItem)
  await wrapped(uid, secondItem)
  await new Promise((resolve) => setTimeout(resolve, 0))
  secondRead.resolve('*.tmp')
  await new Promise((resolve) => setTimeout(resolve, 150))
  firstRead.resolve('*.log')
  await new Promise((resolve) => setTimeout(resolve, 150))

  expect(ExplorerStates.get(uid).newState.items).toEqual([secondItem])
  expect(ExplorerStates.get(uid).newState.sourceControlIgnoredUris).toEqual(['/workspace/second.tmp'])
})
