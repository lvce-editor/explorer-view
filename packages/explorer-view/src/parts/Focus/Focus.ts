import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const setFocus = (key: number): Promise<void> => {
  return ParentRpc.invoke('Focus.setFocus', key)
}
