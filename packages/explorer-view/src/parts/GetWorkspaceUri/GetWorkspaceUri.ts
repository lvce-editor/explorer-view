import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

export const getWorkspaceUri = (applicationId?: string): Promise<string> => {
  return ApplicationRpc.invoke(applicationId, 'Workspace.getUri')
}
