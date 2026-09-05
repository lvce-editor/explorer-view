import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

export const refreshWorkspace = async (applicationId?: string): Promise<void> => {
  try {
    await ApplicationRpc.invoke(applicationId, 'Layout.handleWorkspaceRefresh')
  } catch {
    // ignore
  }
}
