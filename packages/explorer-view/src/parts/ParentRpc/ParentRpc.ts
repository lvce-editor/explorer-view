import type { RendererWorkerApi } from '../RendererWorkerApi/RendererWorkerApi.ts'
import * as RpcId from '../RpcId/RpcId.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const invoke = <T extends keyof RendererWorkerApi>(
  method: T,
  ...params: Parameters<RendererWorkerApi[T]>
): ReturnType<RendererWorkerApi[T]> => {
  const rpc = RpcRegistry.get(RpcId.RendererWorker)
  // @ts-ignore
  return rpc.invoke(method, ...params)
}
