import * as Rpc from '../RendererWorker/RendererWorker.ts'

export const getWorkspacePath = (): Promise<string> => {
  return Rpc.invoke('Workspace.getPath')
}
