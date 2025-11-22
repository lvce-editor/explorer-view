import { SourceControlWorker } from '@lvce-editor/rpc-registry'
import type { FileDecoration } from '../FileDecoration/FileDecoration.ts'
import { ensureUris } from '../EnsureUris/EnsureUris.ts'

export const getFileDecorations = async (
  scheme: string,
  root: string,
  maybeUris: readonly string[],
  decorationsEnabled: boolean,
): Promise<readonly FileDecoration[]> => {
  try {
    if (!decorationsEnabled) {
      return []
    }
    const providerIds = await SourceControlWorker.invoke('SourceControl.getEnabledProviderIds', scheme, root)
    if (providerIds.length === 0) {
      return []
    }
    // TODO how to handle multiple providers?
    const providerId = providerIds.at(-1)
    const uris = ensureUris(maybeUris)
    const decorations = await SourceControlWorker.invoke('SourceControl.getFileDecorations', providerId, uris)
    return decorations
  } catch (error) {
    console.error(error)
    return []
  }
}
