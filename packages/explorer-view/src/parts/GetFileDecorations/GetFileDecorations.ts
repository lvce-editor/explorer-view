import { SourceControlWorker } from '@lvce-editor/rpc-registry'
import { DecorationsEnabled } from '../Config/Config.ts'
import { ensureUris } from '../EnsureUris/EnsureUris.ts'

export const getFileDecorations = async (scheme: string, root: string, maybeUris: readonly string[]): Promise<readonly any[]> => {
  try {
    if (!DecorationsEnabled) {
      return []
    }
    const providerIds = await SourceControlWorker.invoke('SourceControl.getEnabledProviderIds', scheme, root)
    if (providerIds.length === 0) {
      return []
    }
    const providerId = providerIds[0]
    const uris = ensureUris(maybeUris)
    const decorations = await SourceControlWorker.invoke('SourceControl.getFileDecorations', providerId, uris)
    return decorations
  } catch (error) {
    console.error(error)
    return []
  }
}
