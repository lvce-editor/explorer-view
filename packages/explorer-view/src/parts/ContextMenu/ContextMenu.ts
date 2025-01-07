import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const show = async (x: number, y: number, id: number, ...args: readonly any[]): Promise<void> => {
  return ParentRpc.invoke('ContextMenu.show', x, y, id, ...args)
}
