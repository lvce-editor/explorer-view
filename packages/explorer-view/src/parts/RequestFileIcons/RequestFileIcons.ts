import type { IconRequest } from '../IconRequest/IconRequest.ts'
import * as IconThemeWorker from '@lvce-editor/rpc-registry'
import { toSimpleIconRequest } from '../ToSimpleIconRequest/ToSimpleIconRequest.ts'

export const requestFileIcons = async (requests: readonly IconRequest[]): Promise<readonly string[]> => {
  if (requests.length === 0) {
    return []
  }
  const simpleRequests = requests.map(toSimpleIconRequest)
  // @ts-ignore
  const icons = await IconThemeWorker.invoke('IconTheme.getIcons', simpleRequests)
  // @ts-ignore
  return icons
}
