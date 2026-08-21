import type { Rpc } from '@lvce-editor/rpc'
import { RendererProcess as RendererProcessRegistry } from '@lvce-editor/rpc-registry'

const state = {
  connected: false,
}

const postRenderFocusRequests = new Set<number>()

export const isConnected = (): boolean => {
  const { connected } = state
  return connected
}

export const invoke = (method: string, ...params: readonly unknown[]): Promise<any> => {
  return RendererProcessRegistry.invoke(method, ...params)
}

export const requestPostRenderFocus = (uid: number): void => {
  postRenderFocusRequests.add(uid)
}

export const set = (rpc: Rpc): void => {
  RendererProcessRegistry.set(rpc)
  state.connected = true
}

export const takePostRenderFocus = (uid: number): boolean => {
  return postRenderFocusRequests.delete(uid)
}
