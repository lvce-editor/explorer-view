import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as Height from '../Height/Height.ts'
import * as PathSeparatorType from '../PathSeparatorType/PathSeparatorType.ts'

export const create = (id: number, uri: string, x: number, y: number, width: number, height: number, args: any, parentUid: any): any => {
  return {
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
  }
}
