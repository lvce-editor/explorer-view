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
      command: 'newFile',
      icon: MaskIcon.NewFile,
      id: ViewletExplorerStrings.newFile(),
      type: ActionType.Button,
    },
    {
      command: 'newFolder',
      icon: MaskIcon.NewFolder,
      id: ViewletExplorerStrings.newFolder(),
      type: ActionType.Button,
    },
    {
      command: 'refresh',
      icon: MaskIcon.Refresh,
      id: ViewletExplorerStrings.refresh(),
      type: ActionType.Button,
    },
    {
      command: 'collapseAll',
      icon: MaskIcon.CollapseAll,
      id: ViewletExplorerStrings.collapseAll(),
      type: ActionType.Button,
    },
  ]
}
