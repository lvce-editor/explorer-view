import { SourceControlWorker } from '@lvce-editor/rpc-registry'

const ensureUris = (maybeUris: readonly string[]): readonly string[] => {
  const uris: string[] = []
  for (const item of maybeUris) {
    if (item.startsWith('/')) {
      uris.push(`file://` + item)
    } else {
      uris.push(item)
    }
  }
  return uris
}

export const getFileDecorations = async (scheme: string, root: string, maybeUris: readonly string[]): Promise<readonly any[]> => {
  try {
    const providerIds = await SourceControlWorker.invoke('SourceControl.getEnabledProviderIds', scheme, root)
    if (providerIds.length === 0) {
      return []
    }
    // @ts-ignore
    const uris = ensureUris(maybeUris)
    const decorations = await SourceControlWorker.invoke('SourceControl.getFileDecorations', uris)
    return decorations
  } catch (error) {
    console.error(error)
    return []
  }
}
