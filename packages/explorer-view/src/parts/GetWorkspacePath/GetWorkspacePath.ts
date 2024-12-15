import * as Rpc from '../ParentRpc/ParentRpc.ts'

export const getWorkspacePath = (): Promise<string> => {
  return Rpc.invoke('Workspace.getWorkspacePath')
}
