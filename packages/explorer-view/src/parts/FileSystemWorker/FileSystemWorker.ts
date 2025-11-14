import { type RendererWorkerApi, FileSystemWorker } from '@lvce-editor/rpc-registry'
import { RendererWorker } from '@lvce-editor/rpc-registry'

// TODO use direct connection
export const invoke = async <T extends keyof RendererWorkerApi>(
  method: keyof RendererWorkerApi,
  ...params: Parameters<RendererWorkerApi[T]>
): Promise<Awaited<ReturnType<RendererWorkerApi[T]>>> => {
  return RendererWorker.invoke(method, ...params)
}

export const { set } = FileSystemWorker
