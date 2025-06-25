import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import * as Height from '../Height/Height.ts'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.ts'

// TODO parentUid might ot be needed
export const create2 = (
  uid: number,
  uri: string,
  x: number,
  y: number,
  width: number,
  height: number,
  args: any,
  parentUid: any,
  platform: number = 0,
): void => {
  const state: ExplorerState = {
    uid,
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
    confirmDelete: true,
    icons: [],
    platform,
    focus: 0,
    editingErrorMessage: '',
    inputSource: 0,
    editingSelectionEnd: 0,
    editingSelectionStart: 0,
    focusWord: '',
    focusWordTimeout: 800,
    finalDeltaY: 0,
    handleOffset: 0,
    scrollBarActive: false,
    scrollBarHeight: 0,
  }
  ExplorerStates.set(uid, state, state)
}
