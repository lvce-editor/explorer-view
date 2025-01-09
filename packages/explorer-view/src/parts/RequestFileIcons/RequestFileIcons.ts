import type { IconRequest } from '../IconRequest/IconRequest.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as Rpc from '../ParentRpc/ParentRpc.ts'

export const requestFileIcons = async (requests: readonly IconRequest[]): Promise<readonly string[]> => {
  const promises = requests.map((request) =>
    request.type === DirentType.File
      ? Rpc.invoke('IconTheme.getFileIcon', { name: request.name })
      : Rpc.invoke('IconTheme.getFolderIcon', { name: request.name }),
  )
  return Promise.all(promises)
}
