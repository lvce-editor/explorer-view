import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getIntegratedTerminalCwd } from '../GetIntegratedTerminalCwd/GetIntegratedTerminalCwd.ts'

export const openInIntegratedTerminal = async (state: ExplorerState): Promise<ExplorerState> => {
  const cwd = getIntegratedTerminalCwd(state)
  await RendererWorker.invoke('Layout.openIntegratedTerminal', cwd)
  return state
}
