import type { RendererWorkerApi } from '@lvce-editor/rpc-registry'
import * as ParentRpc from '../RendererWorker/RendererWorker.ts'

export const invoke = async <T extends keyof RendererWorkerApi>(
  method: keyof RendererWorkerApi,
  ...params: Parameters<RendererWorkerApi[T]>
): Promise<Awaited<ReturnType<RendererWorkerApi[T]>>> => {
  return ParentRpc.invoke(method, ...params)
}
