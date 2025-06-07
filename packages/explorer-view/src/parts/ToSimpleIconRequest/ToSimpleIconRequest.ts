import type { IconRequest } from '../IconRequest/IconRequest.ts'
import type { SimpleFileIconRequest } from '../RendererWorkerApi/RendererWorkerApi.ts'
import { getSimpleIconRequestType } from '../GetSimpleIconRequestType/GetSimpleIconRequestType.ts'

export const toSimpleIconRequest = (request: IconRequest): SimpleFileIconRequest => {
  return {
    name: request.name,
    type: getSimpleIconRequestType(request.type),
  }
}
