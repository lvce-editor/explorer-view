import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const focusActiveEditor = async (): Promise<void> => {
  try {
    const editorUid = await RendererWorker.invoke('GetActiveEditor.getActiveEditorId')
    if (typeof editorUid !== 'number' || editorUid < 0) {
      throw new Error('active editor not found')
    }
    await RendererProcess.invoke('Viewlet.focusSelector', editorUid, '.EditorInput textarea')
    await RendererProcess.invoke('Viewlet.focusSelectorAfterRender', editorUid, '.EditorInput textarea')
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
        void focusActiveEditor()
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
