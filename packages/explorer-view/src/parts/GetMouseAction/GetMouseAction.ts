import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getMouseAction = (uid: number, button: number, modifiers: any): Promise<any> => {
  return RendererWorker.invoke('MouseActions.get', uid, button, modifiers)
}
