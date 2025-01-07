import type { Rpc } from '@lvce-editor/rpc'

const rpcs: Record<number, Rpc> = Object.create(null)

export const set = (id: number, rpc: Rpc): void => {
  rpcs[id] = rpc
}

export const get = (id: number): Rpc => {
  return rpcs[id]
}

export const remove = (id: number): void => {
  delete rpcs[id]
}
