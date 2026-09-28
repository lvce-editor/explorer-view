import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

export const handleMessagePort = async (
  port: MessagePort,
  viewletCommandMap: Readonly<Record<string, unknown>>,
  setAsRendererProcess = true,
): Promise<void> => {
  const executeViewletCommand = async (uid: number, command: string, ...args: readonly any[]): Promise<void> => {
    const fn = viewletCommandMap[`Explorer.${command}`]
    if (typeof fn !== 'function') {
      throw new TypeError(`Viewlet command not found: ${command}`)
    }
    const applicationId = ExplorerStates.get(uid)?.newState.applicationId
    await fn(uid, ...args)
    await RendererWorker.invoke('Viewlet.requestRender', uid)
    if (RendererProcess.takePostRenderFocus(uid)) {
      setTimeout(() => {
        void ApplicationRpc.invokeForView(applicationId, uid, 'Main.focus').catch(() => {})
      }, 0)
    }
  }

  const rpc = await PlainMessagePortRpc.create({
    commandMap: {
      'Viewlet.executeViewletCommand': executeViewletCommand,
    },
    messagePort: port,
  })
  if (setAsRendererProcess) {
    RendererProcess.set(rpc)
  }
}
