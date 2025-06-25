import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const confirmPaste = async (): Promise<boolean> => {
  // @ts-ignore
  const result = await RendererWorker.invoke('Confirmprompt.prompt', 'Are you sure you want to paste these files?')
  return result === true
}
