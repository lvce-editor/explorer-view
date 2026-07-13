import * as ViewletRegistry from '@lvce-editor/viewlet-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetGitIgnoredUris from '../GetGitIgnoredUris/GetGitIgnoredUris.ts'
import * as GetExplorerMaxLineY from '../GetMaxLineY/GetMaxLineY.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

export const { get, getCommandIds, registerCommands, set, wrapGetter } = ViewletRegistry.create<ExplorerState>()

interface Fn<T extends any[]> {
  (state: ExplorerState, ...args: T): ExplorerState | Promise<ExplorerState>
}

const commandQueues = new Map<number, Promise<void>>()

const runQueuedCommand = async (previousCommand: Promise<void> | undefined, command: () => Promise<void>): Promise<void> => {
  try {
    await previousCommand
  } catch {
    // Keep the queue usable after returning the error to the command caller
  }
  await command()
}

const enqueueCommand = async (id: number, command: () => Promise<void>): Promise<void> => {
  const currentCommand = runQueuedCommand(commandQueues.get(id), command)
  commandQueues.set(id, currentCommand)
  try {
    await currentCommand
  } finally {
    if (commandQueues.get(id) === currentCommand) {
      commandQueues.delete(id)
    }
  }
}

const hasSameVisibleExplorerItemInputs = (oldState: ExplorerState, newState: ExplorerState): boolean => {
  return (
    oldState.items === newState.items &&
    oldState.minLineY === newState.minLineY &&
    oldState.height === newState.height &&
    oldState.itemHeight === newState.itemHeight &&
    oldState.focusedIndex === newState.focusedIndex &&
    oldState.editingIndex === newState.editingIndex &&
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

const maybeUpdateGitIgnoredUris = async (oldState: ExplorerState, newState: ExplorerState): Promise<ExplorerState> => {
  if (oldState.items === newState.items || oldState.sourceControlIgnoredUris !== newState.sourceControlIgnoredUris) {
    return newState
  }
  const { gitIgnoreDecorations, items, pathSeparator, root } = newState
  const sourceControlIgnoredUris = await GetGitIgnoredUris.getGitIgnoredUris(root, items, pathSeparator, gitIgnoreDecorations)
  return {
    ...newState,
    sourceControlIgnoredUris,
  }
}

const wrapListItemCommandInternal = <T extends any[]>(fn: Fn<T>, queued: boolean): ((id: number, ...args: T) => Promise<void>) => {
  const runCommand = async (id: number, ...args: T): Promise<void> => {
    const { newState } = get(id)
    const rawUpdatedState = await fn(newState, ...args)
    if (newState === rawUpdatedState) {
      return
    }
    const updatedState = await maybeUpdateGitIgnoredUris(newState, rawUpdatedState)
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
      return
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
  }
  if (!queued) {
    return runCommand
  }
  const wrappedCommand = async (id: number, ...args: T): Promise<void> => {
    await enqueueCommand(id, async () => {
      await runCommand(id, ...args)
    })
  }
  return wrappedCommand
}

export const wrapListItemCommand = <T extends any[]>(fn: Fn<T>): ((id: number, ...args: T) => Promise<void>) => {
  return wrapListItemCommandInternal(fn, true)
}

export const wrapListItemCommandImmediate = <T extends any[]>(fn: Fn<T>): ((id: number, ...args: T) => Promise<void>) => {
  return wrapListItemCommandInternal(fn, false)
}
