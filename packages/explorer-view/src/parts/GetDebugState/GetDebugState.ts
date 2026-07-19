import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const getDebugState = (state: ExplorerState): Readonly<Record<string, unknown>> => {
  const { editingIndex, editingSessionId, editingType, editingValue, focusedIndex, inputSource, items, root, uid, version, visibleExplorerItems } =
    state
  return {
    editingIndex,
    editingSessionId,
    editingType,
    editingValue,
    focusedIndex,
    inputSource,
    items: items.map((item) => ({
      depth: item.depth,
      name: item.name,
      path: item.path,
      type: item.type,
    })),
    root,
    uid,
    version,
    visibleExplorerItems: visibleExplorerItems.map((item) => ({
      depth: item.depth,
      name: item.name,
      path: item.path,
    })),
  }
}
