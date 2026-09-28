import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

interface OpenUriOptions {
  readonly preview?: boolean
}

export const openUri = async (uri: string, focus: boolean, options?: OpenUriOptions, applicationId?: string): Promise<void> => {
  if (options) {
    await ApplicationRpc.invoke(applicationId, 'Main.openInput', {
      editorInput: {
        type: 'editor',
        uri,
      },
      focus,
      preview: options.preview ?? false,
    })
    return
  }
  await ApplicationRpc.invoke(applicationId, 'Main.openUri', { focus, uri })
}
