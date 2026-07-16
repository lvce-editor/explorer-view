import { RendererWorker } from '@lvce-editor/rpc-registry'

interface OpenUriOptions {
  readonly preview?: boolean
}

export const openUri = async (uri: string, focus: boolean, options?: OpenUriOptions): Promise<void> => {
  if (options) {
    await RendererWorker.openUri(uri, /* focus */ focus, options)
    return
  }
  await RendererWorker.openUri(uri, /* focus */ focus)
}
