import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const getDebugState = (state: ExplorerState): Readonly<Record<string, unknown>> => {
  return {
    editingIndex: state.editingIndex,
    editingType: state.editingType,
    editingValue: state.editingValue,
    focusedIndex: state.focusedIndex,
    items: state.items.map((item) => ({
      depth: item.depth,
      name: item.name,
      path: item.path,
      type: item.type,
    })),
    root: state.root,
    uid: state.uid,
    version: state.version,
    visibleExplorerItems: state.visibleExplorerItems.map((item) => ({
      depth: item.depth,
      name: item.name,
      type: item.type,
    })),
  }
}
