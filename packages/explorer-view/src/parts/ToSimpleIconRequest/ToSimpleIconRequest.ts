import { getSimpleIconRequestType } from '../GetSimpleIconRequestType/GetSimpleIconRequestType.ts'
import type { IconRequest } from '../IconRequest/IconRequest.ts'

export const toSimpleIconRequest = (request: IconRequest): any => {
  return {
    name: request.name,
    type: getSimpleIconRequestType(request.type),
  }
}
