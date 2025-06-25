import type { NativeFilesResult } from '../NativeFilesResult/NativeFilesResult.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const writeText = async (text: string): Promise<void> => {
  await RendererWorker.invoke('ClipBoard.writeText', /* text */ text)
}

export const readNativeFiles = async (): Promise<NativeFilesResult> => {
  // @ts-ignore
  return RendererWorker.invoke('ClipBoard.readNativeFiles')
}

export const writeNativeFiles = async (type: string, files: readonly string[]): Promise<void> => {
  return RendererWorker.invoke('ClipBoard.writeNativeFiles', type, files)
}
