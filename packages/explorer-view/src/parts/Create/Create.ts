import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import * as Height from '../Height/Height.ts'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.ts'

// TODO parentUid might ot be needed
export const create = (id: number, uri: string, x: number, y: number, width: number, height: number, args: any, parentUid: any): any => {
  const state: ExplorerState = {
    uid: id,
    parentUid,
    root: '',
    items: [],
    focusedIndex: -1,
    focused: false,
    hoverIndex: -1,
    x,
    y,
    width,
    height,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 0,
    pathSeparator: PathSeparatorType.Slash,
    version: 0,
    editingIndex: -1,
    itemHeight: Height.ListItem,
    dropTargets: [],
    excluded: [],
    editingValue: '',
    editingType: ExplorerEditingType.None,
    editingIcon: '',
    fileIconCache: Object.create(null),
    useChevrons: false,
    icons: [],
  }
  ExplorerStates.set(state.uid, state, state)
  return state
}
