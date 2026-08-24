import { expect, test } from '@jest/globals'
import * as ActionType from '../src/parts/ActionType/ActionType.ts'
import * as AriaRoles from '../src/parts/AriaRoles/AriaRoles.ts'
import * as GetActionButtonVirtualDom from '../src/parts/GetActionButtonVirtualDom/GetActionButtonVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getActionButtonVirtualDom', () => {
  const action = {
    command: 'newFile',
    icon: 'NewFile',
    id: 'New File',
    name: 'NewFile',
    type: ActionType.Button,
  }
  expect(GetActionButtonVirtualDom.getActionButtonVirtualDom(action)).toEqual([
    {
      childCount: 1,
      className: 'IconButton',
      name: 'NewFile',
      title: 'New File',
      type: VirtualDomElements.Button,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconNewFile',
      role: AriaRoles.None,
      type: VirtualDomElements.Div,
    },
  ])
})
