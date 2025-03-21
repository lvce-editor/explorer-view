import type { ViewletAction } from '../ViewletAction/ViewletAction.ts'
import * as ActionType from '../ActionType/ActionType.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as MaskIcon from '../MaskIcon/MaskIcon.ts'

export const getActions = (root: string): readonly ViewletAction[] => {
  if (!root) {
    return []
  }
  return [
    {
      type: ActionType.Button,
      id: ViewletExplorerStrings.newFile(),
      icon: MaskIcon.NewFile,
      command: 'newFile',
    },
    {
      type: ActionType.Button,
      id: ViewletExplorerStrings.newFolder(),
      icon: MaskIcon.NewFolder,
      command: 'newFolder',
    },
    {
      type: ActionType.Button,
      id: ViewletExplorerStrings.refresh(),
      icon: MaskIcon.Refresh,
      command: 'refresh',
    },
    {
      type: ActionType.Button,
      id: ViewletExplorerStrings.collapseAll(),
      icon: MaskIcon.CollapseAll,
      command: 'collapseAll',
    },
  ]
}
