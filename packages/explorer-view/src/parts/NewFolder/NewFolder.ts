import * as NewDirent from '../NewDirent/NewDirent.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const newFolder = (state: any): any => {
  return NewDirent.newDirent(state, ExplorerEditingType.CreateFolder)
}
