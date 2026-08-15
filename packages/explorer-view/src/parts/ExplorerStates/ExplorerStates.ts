import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../CommandCompletion/CommandCompletion.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetGitIgnoredUris from '../GetGitIgnoredUris/GetGitIgnoredUris.ts'
import * as GetExplorerMaxLineY from '../GetMaxLineY/GetMaxLineY.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const { get, getCommandIds, registerCommands, set, wrapGetter } = ViewletRegistry.create<ExplorerState>()

interface Fn<T extends any[]> {
  (state: ExplorerState, ...args: T): ExplorerState | Promise<ExplorerState>
}

const commandQueues = new Map<number, Promise<void>>()

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

export const updateGitIgnoredUris = async (state: ExplorerState, generation: number): Promise<ExplorerState> => {
  const { gitIgnoreDecorations, items, pathSeparator, root, uid } = state
  const sourceControlIgnoredUris = await GetGitIgnoredUris.getGitIgnoredUris(root, items, pathSeparator, gitIgnoreDecorations)
  const current = get(uid).newState
  if (current.gitIgnoreGeneration !== generation) {
    return state
  }
  return {
    ...current,
    sourceControlIgnoredUris,
  }
}

const maybeScheduleGitIgnoredUrisUpdate = (oldState: ExplorerState, newState: ExplorerState): void => {
  if (
    !newState.gitIgnoreDecorations ||
    oldState.items === newState.items ||
    oldState.sourceControlIgnoredUris !== newState.sourceControlIgnoredUris
  ) {
    return
  }
  setTimeout(() => {
    void RendererWorker.invoke('Viewlet.executeViewletCommand', newState.uid, 'updateGitIgnoredUris', newState.gitIgnoreGeneration).catch(() => {
      // Ignored decorations are optional and must not block explorer interaction.
    })
  }, 0)
}

const wrapListItemCommandInternal = <T extends any[]>(fn: Fn<T>, queued: boolean): ((id: number, ...args: T) => Promise<void>) => {
  const runCommand = async (id: number, ...args: T): Promise<CommandRunResult> => {
    const { newState } = get(id)
    const rawUpdatedState = await fn(newState, ...args)
    const completion = CommandCompletion.take(rawUpdatedState)
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
      if (updatedState.inputSource === InputSource.User) {
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
      const result = await runCommand(id, ...args)
      await result.completion
    }
  }
  const wrappedCommand = async (id: number, ...args: T): Promise<void> => {
    await enqueueCommand(id, () => runCommand(id, ...args))
  }
  return wrappedCommand
}

export const wrapListItemCommand = <T extends any[]>(fn: Fn<T>): ((id: number, ...args: T) => Promise<void>) => {
  return wrapListItemCommandInternal(fn, true)
}

export const wrapListItemCommandImmediate = <T extends any[]>(fn: Fn<T>): ((id: number, ...args: T) => Promise<void>) => {
  return wrapListItemCommandInternal(fn, false)
}
