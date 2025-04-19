import { expect, test } from '@jest/globals'
import type { ViewletAction } from '../src/parts/ViewletAction/ViewletAction.ts'
import * as ActionType from '../src/parts/ActionType/ActionType.ts'
import { getActionVirtualDom } from '../src/parts/GetActionVirtualDom/GetActionVirtualDom.ts'

test('getActionVirtualDom - button action', () => {
  const action: ViewletAction = {
    type: ActionType.Button,
    id: 'test-button',
    command: 'test.command',
    icon: 'test-icon',
  }
  const result = getActionVirtualDom(action)
  expect(result).toHaveLength(2)
  expect(result[0].type).toBe(1)
})

test('getActionVirtualDom - unknown action type', () => {
  const action: ViewletAction = {
    type: 999, // Using a number that's not defined in ActionType
    id: 'test-unknown',
    command: 'test.command',
  }
  const result = getActionVirtualDom(action)
  expect(result).toEqual([])
})
