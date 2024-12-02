import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const getFilePathElectron = async (file: any): Promise<string> => {
  return ParentRpc.invoke('GetFilePathElectron.getFilePathElectron', file)
}