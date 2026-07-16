import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'
import * as ActionType from '../ActionType/ActionType.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as InputName from '../InputName/InputName.ts'
import * as MaskIcon from '../MaskIcon/MaskIcon.ts'

export const getActions = (root: string, isReadonly: boolean): readonly ViewletAction[] => {
  if (!root) {
    return []
  }
  const actions: ViewletAction[] = []
  if (!isReadonly) {
    actions.push(
      {
        command: 'newFile',
        icon: MaskIcon.NewFile,
        id: ViewletExplorerStrings.newFile(),
        name: InputName.NewFile,
        type: ActionType.Button,
      },
      {
        command: 'newFolder',
        icon: MaskIcon.NewFolder,
        id: ViewletExplorerStrings.newFolder(),
        name: InputName.NewFolder,
        type: ActionType.Button,
      },
    )
  }
  actions.push(
    {
      command: 'refresh',
      icon: MaskIcon.Refresh,
      id: ViewletExplorerStrings.refresh(),
      name: InputName.Refresh,
      type: ActionType.Button,
    },
    {
      command: 'collapseAll',
      icon: MaskIcon.CollapseAll,
      id: ViewletExplorerStrings.collapseAll(),
      name: InputName.CollapseAll,
      type: ActionType.Button,
    },
  )
  return actions
}
