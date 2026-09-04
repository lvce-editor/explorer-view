import type { Rpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry } from '@lvce-editor/rpc-registry'

const state = {
  connected: false,
}

const postRenderFocusRequests = new Map<number, number>()

export const isConnected = (): boolean => {
  const { connected } = state
  return connected
}

export const invoke = (method: string, ...params: readonly unknown[]): Promise<any> => {
  return RendererProcessRegistry.invoke(method, ...params)
}

export const invokeAndTransfer = (method: string, ...params: readonly unknown[]): Promise<any> => {
  return RendererProcessRegistry.invokeAndTransfer(method, ...params)
}

export const requestPostRenderFocus = (uid: number, delay = 0): void => {
  postRenderFocusRequests.set(uid, delay)
}

export const set = (rpc: Rpc): void => {
  RendererProcessRegistry.set(rpc)
  state.connected = true
}

export const takePostRenderFocus = (uid: number): number | undefined => {
  const delay = postRenderFocusRequests.get(uid)
  postRenderFocusRequests.delete(uid)
  return delay
}
