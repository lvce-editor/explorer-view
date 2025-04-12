import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const getFilePathElectron = async (file: File): Promise<string> => {
  return ParentRpc.invoke('FileSystemHandle.getFilePathElectron', file)
}
