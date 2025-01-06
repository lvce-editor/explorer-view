import { expect, test } from '@jest/globals'
import * as ActionType from '../src/parts/ActionType/ActionType.ts'
import * as ViewletExplorerStrings from '../src/parts/ExplorerStrings/ExplorerStrings.ts'
import * as GetActions from '../src/parts/GetActions/GetActions.ts'
import * as MaskIcon from '../src/parts/MaskIcon/MaskIcon.ts'

test('getActions - with root', () => {
  expect(GetActions.getActions('/test-root')).toEqual([
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
  ])
})

test('getActions - no root', () => {
  expect(GetActions.getActions('')).toEqual([])
})
