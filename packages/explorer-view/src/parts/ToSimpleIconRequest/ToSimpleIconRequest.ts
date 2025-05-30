import type { IconRequest } from '../IconRequest/IconRequest.ts'
import type { SimpleFileIconRequest } from '../RendererWorkerApi/RendererWorkerApi.ts'
import * as DirentType from '../DirentType/DirentType.ts'

const getSimpleType = (direntType: number): 1 | 2 => {
  if (
    direntType === DirentType.Directory ||
    direntType === DirentType.DirectoryExpanded ||
    direntType === DirentType.EditingDirectoryExpanded ||
    direntType === DirentType.EditingFolder
  ) {
    return 2
  }
  return 1
}

export const toSimpleIconRequest = (request: IconRequest): SimpleFileIconRequest => {
  return {
    name: request.name,
    type: getSimpleType(request.type),
  }
}
