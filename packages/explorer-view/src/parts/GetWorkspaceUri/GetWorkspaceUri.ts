import { RendererWorker as Rpc } from '@lvce-editor/rpc-registry'

export const getWorkspaceUri = (): Promise<string> => {
  return Rpc.invoke('Workspace.getUri')
}
