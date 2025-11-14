import type { NativeFilesResult } from '../NativeFilesResult/NativeFilesResult.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const writeText = async (text: string): Promise<void> => {
  await RendererWorker.writeClipBoardText(text)
}

export const readNativeFiles = async (): Promise<NativeFilesResult | undefined> => {
  // @ts-ignore
  return RendererWorker.invoke('ClipBoard.readNativeFiles')
}

export const writeNativeFiles = async (type: string, files: readonly string[]): Promise<void> => {
  return RendererWorker.invoke('ClipBoard.writeNativeFiles', type, files)
}
