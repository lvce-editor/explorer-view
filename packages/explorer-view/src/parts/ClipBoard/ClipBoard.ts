import * as ParentRpc from '../RendererWorker/RendererWorker.ts'

export const writeText = async (text: string): Promise<void> => {
  await ParentRpc.invoke('ClipBoard.writeText', /* text */ text)
}

export const readNativeFiles = async (): Promise<any> => {
  return ParentRpc.invoke('ClipBoard.readNativeFiles')
}

export const writeNativeFiles = async (type: string, files: readonly string[]): Promise<void> => {
  return ParentRpc.invoke('ClipBoard.writeNativeFiles', type, files)
}
