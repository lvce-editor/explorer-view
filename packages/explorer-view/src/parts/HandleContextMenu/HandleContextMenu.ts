import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as ViewletExplorerHandleContextMenuKeyBoard from '../HandleContextMenuKeyboard/HandleContextMenuKeyboard.ts'
import * as ViewletExplorerHandleContextMenuMouseAt from '../HandleContextMenuMouseAt/HandleContextMenuMouseAt.ts'

export const handleContextMenu = (state: any, button: number, x: number, y: number): Promise<any> => {
  switch (button) {
    case MouseEventType.Keyboard:
      return ViewletExplorerHandleContextMenuKeyBoard.handleContextMenuKeyboard(state)
    default:
      return ViewletExplorerHandleContextMenuMouseAt.handleContextMenuMouseAt(state, x, y)
  }
}
