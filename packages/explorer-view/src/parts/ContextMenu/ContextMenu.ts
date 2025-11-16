import { RendererWorker } from '@lvce-editor/rpc-registry'

export const show = async (x: number, y: number, id: number, ...args: readonly any[]): Promise<void> => {
  return RendererWorker.showContextMenu(x, y, id, ...args)
}

export const show2 = async (uid: number, menuId: any, x: number, y: number, args: any): Promise<void> => {
  await RendererWorker.showContextMenu2(uid, menuId, x, y, args)
}
