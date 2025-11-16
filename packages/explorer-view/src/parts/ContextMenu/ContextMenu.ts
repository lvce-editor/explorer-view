import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ContextMenuProps } from '../ContextMenuProps/ContextMenuProps.ts'

export const show = async (x: number, y: number, id: number, ...args: readonly any[]): Promise<void> => {
  return RendererWorker.showContextMenu(x, y, id, ...args)
}

export const show2 = async <T extends ContextMenuProps>(
  uid: number,
  menuId: ContextMenuProps['menuId'],
  x: number,
  y: number,
  args: ContextMenuProps,
): Promise<void> => {
  await RendererWorker.showContextMenu2(uid, menuId, x, y, args)
}
