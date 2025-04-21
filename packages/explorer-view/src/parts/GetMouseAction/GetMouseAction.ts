import * as RendererWorker from '../ParentRpc/ParentRpc.ts'

export const getMouseAction = (uid: number, button: number, modifiers: any): Promise<any> => {
  return RendererWorker.invoke('MouseActions.get', uid, button, modifiers)
}
