import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

const renderItems = {
  isEqual(oldState: ExplorerState, newState: ExplorerState): any {
    return (
      oldState.items === newState.items &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.editingIndex === newState.editingIndex &&
      oldState.editingType === newState.editingType &&
      oldState.editingValue === newState.editingValue &&
      oldState.width === newState.width &&
      oldState.focused === newState.focused
    )
  },
  apply(oldState: ExplorerState, newState: ExplorerState): any {
    const visibleDirents = GetVisibleExplorerItems.getVisibleExplorerItems(
      newState.items,
      newState.minLineY,
      newState.maxLineY,
      newState.focusedIndex,
      newState.editingIndex,
      newState.editingType,
      newState.editingValue,
      newState.icons,
      newState.useChevrons,
    )
    const isWide = newState.width > 450
    const dom = GetExplorerVirtualDom.getExplorerVirtualDom(visibleDirents, newState.focusedIndex, newState.root, isWide, newState.focused)
    return ['Viewlet.setDom2', dom]
  },
}

// TODO add virtual dom diffing so that focus is not lost when updating dom
// const renderFocus = {
//   isEqual(oldState: any, newState: any) {
//     return oldState.focusedIndex === newState.focusedIndex && oldState.focused === newState.focused && oldState.minLineY === newState.minLineY
//   },
//   apply(oldState: any, newState: any) {
//     const oldFocusedIndex = oldState.focusedIndex - oldState.minLineY
//     const newFocusedIndex = newState.focusedIndex - newState.minLineY
//     return [/* method */ 'setFocusedIndex', /* oldindex */ oldFocusedIndex, /* newIndex */ newFocusedIndex, /* focused */ newState.focused]
//   },
// }

// const renderDropTargets = {
//   isEqual(oldState:any, newState:any) {
//     return oldState.dropTargets === newState.dropTargets
//   },
//   apply(oldState:any, newState:any) {
//     return [/* method */ 'setDropTargets', /* oldDropTargets */ oldState.dropTargets, /* newDropTargets */ newState.dropTargets]
//   },
// }

const renderEditingIndex = {
  isEqual(oldState: ExplorerState, newState: ExplorerState): any {
    return oldState.editingIndex === newState.editingIndex && oldState.editingType === newState.editingType
  },
  apply(oldState: ExplorerState, newState: ExplorerState): any {
    // @ts-ignore
    const { editingIndex, editingType, editingValue } = newState
    return ['focusInput', 'ExplorerInput']
  },
}

const render = [renderItems, renderEditingIndex]

export const doRender = (uid: number, _: any): any => {
  if (typeof uid === 'number') {
    const { oldState, newState } = ExplorerStates.get(uid)
    const commands = []
    for (const fn of render) {
      if (!fn.isEqual(oldState, newState)) {
        commands.push(fn.apply(oldState, newState))
      }
    }
    return commands
  }
  // deprecated
  const oldState = uid
  const newState = _
  const commands = []
  for (const fn of render) {
    if (!fn.isEqual(oldState, newState)) {
      commands.push(fn.apply(oldState, newState))
    }
  }
  return commands
}
