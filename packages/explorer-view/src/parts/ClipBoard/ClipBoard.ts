import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const writeText = async (text: string): Promise<void> => {
  await ParentRpc.invoke('ClipBoard.writeText', /* text */ text)
}

export const readNativeFiles = async (): Promise<any> => {
  return ParentRpc.invoke('ClipBoard.readNativeFiles')
}

export const writeNativeFiles = async (type: string, files: any): Promise<any> => {
  return ParentRpc.invoke('ClipBoard.writeNativeFiles', type, files)
}
