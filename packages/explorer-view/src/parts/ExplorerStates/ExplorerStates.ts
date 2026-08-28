import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../CommandCompletion/CommandCompletion.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetGitIgnoredUris from '../GetGitIgnoredUris/GetGitIgnoredUris.ts'
import * as GetExplorerMaxLineY from '../GetMaxLineY/GetMaxLineY.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import { syncExpandedPaths } from '../SyncExpandedPaths/SyncExpandedPaths.ts'

export const { get, getCommandIds, registerCommands, set, wrapGetter } = ViewletRegistry.create<ExplorerState>()

interface Fn<T extends any[]> {
  (state: ExplorerState, ...args: T): ExplorerState | Promise<ExplorerState>
}

const commandQueues = new Map<number, Promise<void>>()
const gitIgnoreApplyDelay = 100

interface PendingGitIgnoreUpdate {
  readonly run: () => void
  readonly timer: NodeJS.Timeout
}

const pendingGitIgnoreUpdates = new Map<number, PendingGitIgnoreUpdate>()

interface CommandRunResult {
  readonly completion: Promise<void> | undefined
}

const runQueuedCommand = async (previousCommand: Promise<void> | undefined, command: () => Promise<CommandRunResult>): Promise<CommandRunResult> => {
  await previousCommand
  return command()
}

const waitForStateCommand = async (command: Promise<CommandRunResult>): Promise<void> => {
  try {
    await command
  } catch {
    // Keep the queue usable after returning the error to the command caller
  }
}

const enqueueCommand = async (id: number, command: () => Promise<CommandRunResult>): Promise<void> => {
  const stateCommand = runQueuedCommand(commandQueues.get(id), command)
  const queuedStateCommand = waitForStateCommand(stateCommand)
  commandQueues.set(id, queuedStateCommand)
  let result: CommandRunResult
  try {
    result = await stateCommand
  } finally {
    if (commandQueues.get(id) === queuedStateCommand) {
      commandQueues.delete(id)
    }
  }
  await result.completion
}

const hasSameVisibleExplorerItemInputs = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return (
    oldState.items === newState.items &&
    oldState.minLineY === newState.minLineY &&
    oldState.height === newState.height &&
    oldState.itemHeight === newState.itemHeight &&
    oldState.focusedIndex === newState.focusedIndex &&
    oldState.editingIndex === newState.editingIndex &&
    oldState.editingSessionId === newState.editingSessionId &&
    oldState.editingIcon === newState.editingIcon &&
    oldState.cutItems === newState.cutItems &&
    oldState.editingErrorMessage === newState.editingErrorMessage &&
    oldState.dropTargets === newState.dropTargets &&
    oldState.fileIconCache === newState.fileIconCache &&
    oldState.decorations === newState.decorations &&
    oldState.useChevrons === newState.useChevrons &&
    oldState.sourceControlIgnoredUris === newState.sourceControlIgnoredUris
  )
}

const hasSameDragDataInputs = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.isPointerDown === newState.isPointerDown && oldState.pointerDownIndex === newState.pointerDownIndex
}

const hasSameFocusInputs = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return oldState.focus === newState.focus && oldState.focused === newState.focused && oldState.focusGeneration === newState.focusGeneration
}

export const updateGitIgnoredUris = (state: ExplorerState, generation: number, sourceControlIgnoredUris: readonly string[]): ExplorerState => {
  const { gitIgnoreGeneration } = state
  if (gitIgnoreGeneration !== generation) {
    return state
  }
  return {
    ...state,
    sourceControlIgnoredUris,
  }
}

const scheduleGitIgnoredUrisUpdate = (uid: number, generation: number, sourceControlIgnoredUris: readonly string[]): void => {
  const previous = pendingGitIgnoreUpdates.get(uid)
  if (previous) {
    clearTimeout(previous.timer)
  }
  const run = (): void => {
    pendingGitIgnoreUpdates.delete(uid)
    void RendererWorker.invoke('Viewlet.executeViewletCommand', uid, 'updateGitIgnoredUris', generation, sourceControlIgnoredUris).catch(() => {
      // Ignored decorations are optional and must not block explorer interaction.
    })
  }
  const timer = setTimeout(run, gitIgnoreApplyDelay)
  pendingGitIgnoreUpdates.set(uid, { run, timer })
}

const postponeGitIgnoredUrisUpdate = (uid: number): void => {
  const pending = pendingGitIgnoreUpdates.get(uid)
  if (!pending) {
    return
  }
  clearTimeout(pending.timer)
  const timer = setTimeout(pending.run, gitIgnoreApplyDelay)
  pendingGitIgnoreUpdates.set(uid, { run: pending.run, timer })
}

const maybeScheduleGitIgnoredUrisUpdate = (oldState: ExplorerState, newState: ExplorerState): void => {
  if (
    !newState.gitIgnoreDecorations ||
    oldState.items === newState.items ||
    oldState.sourceControlIgnoredUris !== newState.sourceControlIgnoredUris
  ) {
    return
  }
  const { gitIgnoreDecorations, gitIgnoreGeneration, items, pathSeparator, root, uid } = newState
  setTimeout(() => {
    void GetGitIgnoredUris.getGitIgnoredUris(root, items, pathSeparator, gitIgnoreDecorations)
      .then((sourceControlIgnoredUris) => {
        scheduleGitIgnoredUrisUpdate(uid, gitIgnoreGeneration, sourceControlIgnoredUris)
      })
      .catch(() => {
        // Ignored decorations are optional and must not block explorer interaction.
      })
  }, 0)
}

const wrapListItemCommandInternal = <T extends any[]>(fn: Fn<T>, queued: boolean): ((id: number, ...args: T) => Promise<void>) => {
  const runCommand = async (id: number, ...args: T): Promise<CommandRunResult> => {
    const { newState } = get(id)
    const commandState = await fn(newState, ...args)
    const completion = CommandCompletion.take(commandState)
    const rawUpdatedState = syncExpandedPaths(commandState)
    if (newState === rawUpdatedState) {
      return {
        completion,
      }
    }
    const gitIgnoreInputsChanged =
      newState.items !== rawUpdatedState.items ||
      newState.root !== rawUpdatedState.root ||
      newState.pathSeparator !== rawUpdatedState.pathSeparator ||
      newState.gitIgnoreDecorations !== rawUpdatedState.gitIgnoreDecorations
    const updatedState = gitIgnoreInputsChanged
      ? {
          ...rawUpdatedState,
          gitIgnoreGeneration: newState.gitIgnoreGeneration + 1,
        }
      : rawUpdatedState
    const {
      cutItems,
      decorations,
      dropTargets,
      editingErrorMessage,
      editingIcon,
      editingIndex,
      fileIconCache,
      focusedIndex,
      height,
      itemHeight,
      items,
      minLineY,
      sourceControlIgnoredUris,
      useChevrons,
    } = updatedState
    const intermediate = get(id)
    set(id, intermediate.oldState, updatedState, intermediate.scheduledState)
    if (hasSameVisibleExplorerItemInputs(intermediate.newState, updatedState)) {
      if (
        updatedState.inputSource === InputSource.User ||
        !hasSameDragDataInputs(intermediate.newState, updatedState) ||
        !hasSameFocusInputs(intermediate.newState, updatedState)
      ) {
        set(id, intermediate.oldState, updatedState)
      }
      return {
        completion,
      }
    }
    const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, items.length)
    const visible = items.slice(minLineY, maxLineY)
    const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
    const visibleExplorerItems = GetVisibleExplorerItems.getVisibleExplorerItems(
      items,
      minLineY,
      maxLineY,
      focusedIndex,
      editingIndex,
      editingErrorMessage,
      icons,
      useChevrons,
      dropTargets,
      editingIcon,
      cutItems,
      sourceControlIgnoredUris,
      decorations,
    )
    const finalState: ExplorerState = {
      ...updatedState,
      fileIconCache: newFileIconCache,
      icons,
      maxLineY,
      visibleExplorerItems,
    }
    const intermediate2 = get(id)
    set(id, intermediate2.oldState, finalState)
    maybeScheduleGitIgnoredUrisUpdate(newState, finalState)
    return {
      completion,
    }
  }
  if (!queued) {
    return async (id: number, ...args: T): Promise<void> => {
      try {
        const result = await runCommand(id, ...args)
        await result.completion
      } finally {
        postponeGitIgnoredUrisUpdate(id)
      }
    }
  }
  const wrappedCommand = async (id: number, ...args: T): Promise<void> => {
    try {
      await enqueueCommand(id, () => runCommand(id, ...args))
    } finally {
      postponeGitIgnoredUrisUpdate(id)
    }
  }
  return wrappedCommand
}

export const wrapListItemCommand = <T extends any[]>(fn: Fn<T>): ((id: number, ...args: T) => Promise<void>) => {
  return wrapListItemCommandInternal(fn, true)
}

export const wrapListItemCommandImmediate = <T extends any[]>(fn: Fn<T>): ((id: number, ...args: T) => Promise<void>) => {
  return wrapListItemCommandInternal(fn, false)
}
