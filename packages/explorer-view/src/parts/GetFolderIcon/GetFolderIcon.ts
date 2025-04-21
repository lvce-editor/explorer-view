import * as Rpc from '../ParentRpc/ParentRpc.ts'

export const getFolderIcon = async (name: string): Promise<string> => {
  return Rpc.invoke('IconTheme.getFolderIcon', { name })
}
