import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ViewletExplorerHandleContextMenuKeyBoard from '../HandleContextMenuKeyboard/HandleContextMenuKeyboard.ts'
import * as ViewletExplorerHandleContextMenuMouseAt from '../HandleContextMenuMouseAt/HandleContextMenuMouseAt.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

export interface ContextMenuHandler {
  (state: ExplorerState, x: number, y: number): Promise<ExplorerState>
}

export const getContextMenuHandler = (button: number): ContextMenuHandler => {
  switch (button) {
    case MouseEventType.Keyboard:
      return ViewletExplorerHandleContextMenuKeyBoard.handleContextMenuKeyboard
    default:
      return ViewletExplorerHandleContextMenuMouseAt.handleContextMenuMouseAt
  }
}
