import * as NewDirent from '../NewDirent/NewDirent.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

// TODO much shared logic with newFolder
export const newFile = (state: any): any => {
  return NewDirent.newDirent(state, ExplorerEditingType.CreateFile)
}
