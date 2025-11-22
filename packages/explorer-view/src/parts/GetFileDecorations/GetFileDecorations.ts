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

export const getFileDecorations = async (maybeUris: readonly string[]): Promise<readonly any[]> => {
  try {
    // @ts-ignore
    const uris = ensureUris(maybeUris)
    const decorations = await SourceControlWorker.invoke('SourceControl.getDecorations', uris)
    return decorations
  } catch {
    return []
  }
}
