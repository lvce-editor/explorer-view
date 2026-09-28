import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import { getIntegratedTerminalCwd } from '../GetIntegratedTerminalCwd/GetIntegratedTerminalCwd.ts'

export const openInIntegratedTerminal = async (state: ExplorerState): Promise<ExplorerState> => {
  const { applicationId } = state
  const cwd = getIntegratedTerminalCwd(state)
  await ApplicationRpc.invoke(applicationId, 'Layout.openIntegratedTerminal', cwd)
  return state
}
