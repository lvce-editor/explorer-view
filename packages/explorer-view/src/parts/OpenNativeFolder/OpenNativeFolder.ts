import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const openNativeFolder = async (path: string): Promise<void> => {
  await ParentRpc.invoke('OpenNativeFolder.openNativeFolder', /* path */ path)
}
