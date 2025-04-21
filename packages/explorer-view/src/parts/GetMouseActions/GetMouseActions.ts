import type { MouseAction } from '../MouseAction/MouseAction.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const getMouseActions = (): readonly MouseAction[] => {
  return [
    {
      description: 'Open file on click',
      button: MouseEventType.LeftClick,
      modifiers: {},
      command: 'Explorer.openFile',
      when: WhenExpression.FocusExplorer,
    },
    {
      description: 'Toggle selection with Ctrl+Click',
      button: MouseEventType.LeftClick,
      modifiers: {
        ctrl: true,
      },
      command: 'Explorer.toggleSelection',
      when: WhenExpression.FocusExplorer,
    },
    {
      description: 'Select range with Shift+Click',
      button: MouseEventType.LeftClick,
      modifiers: {
        shift: true,
      },
      command: 'Explorer.rangeSelection',
      when: WhenExpression.FocusExplorer,
    },
  ]
}
