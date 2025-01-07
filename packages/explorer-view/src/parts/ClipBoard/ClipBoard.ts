import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const writeText = async (text: string): Promise<void> => {
  await ParentRpc.invoke('ClipBoard.writeText', /* text */ text)
}

export const readNativeFiles = async (): Promise<readonly string[]> => {
  return ParentRpc.invoke('ClipBoard.readNativeFiles')
}

export const writeNativeFiles = async (type: string, files: readonly string[]): Promise<void> => {
  return ParentRpc.invoke('ClipBoard.writeNativeFiles', type, files)
}
