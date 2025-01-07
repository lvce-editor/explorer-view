import * as GetExplorerVirtualDom from '../GetExplorerVirtualDom/GetExplorerVirtualDom.ts'
import * as GetVisibleExplorerItems from '../GetVisibleExplorerItems/GetVisibleExplorerItems.ts'

const renderItems = {
  isEqual(oldState: any, newState: any): any {
    return (
      JSON.stringify(oldState.items) === JSON.stringify(newState.items) &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY &&
      oldState.focusedIndex === newState.focusedIndex &&
      oldState.editingIndex === newState.editingIndex &&
      oldState.editingType === newState.editingType &&
      oldState.editingValue === newState.editingValue &&
      oldState.width === newState.width
    )
  },
  apply(oldState: any, newState: any): any {
    const useChevrons = false
    const visibleDirents = GetVisibleExplorerItems.getVisibleExplorerItems(
      newState.items,
      newState.minLineY,
      newState.maxLineY,
      newState.focusedIndex,
      newState.editingIndex,
      newState.editingType,
      newState.editingValue,
      newState.icons,
      useChevrons,
    )
    const isWide = newState.width > 450
    const dom = GetExplorerVirtualDom.getExplorerVirtualDom(visibleDirents, newState.focusedIndex, newState.root, isWide)
    return ['Viewlet.setDom2', dom]
  },
}

// const renderFocusedIndex = {
//   isEqual(oldState:any, newState:any) {
//     return oldState.focusedIndex === newState.focusedIndex && oldState.focused === newState.focused && oldState.minLineY === newState.minLineY
//   },
//   apply(oldState:any, newState:any) {
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
  isEqual(oldState: any, newState: any): any {
    return oldState.editingIndex === newState.editingIndex && oldState.editingType === newState.editingType
  },
  apply(oldState: any, newState: any): any {
    // @ts-ignore
    const { editingIndex, editingType, editingValue } = newState
    return ['focusInput', 'ExplorerInput']
  },
}

const render = [renderItems, renderEditingIndex]

export const doRender = (oldState: any, newState: any): any => {
  const commands = []
  for (const fn of render) {
    if (!fn.isEqual(oldState, newState)) {
      commands.push(fn.apply(oldState, newState))
    }
  }
  return commands
}
