import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const focusMainArea = async (): Promise<void> => {
  try {
    const mainAreaUid = await RendererProcess.invoke('DirectView.getUid', 'MainArea')
    await RendererProcess.invoke('Viewlet.focusSelector', mainAreaUid, '[name="editor"]')
  } catch {
    await RendererWorker.invoke('Main.focus')
  }
}

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
    await fn(uid, ...args)
    await RendererWorker.invoke('Viewlet.requestRender', uid)
    if (RendererProcess.takePostRenderFocus(uid)) {
      setTimeout(() => {
        void focusMainArea()
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
