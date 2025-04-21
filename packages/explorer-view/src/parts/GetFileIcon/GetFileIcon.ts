import * as Rpc from '../ParentRpc/ParentRpc.ts'

export const getFileIcon = async (name: string): Promise<string> => {
  return Rpc.invoke('IconTheme.getFileIcon', { name })
}
