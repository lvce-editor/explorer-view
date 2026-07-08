import type { IconRequest } from '../IconRequest/IconRequest.ts'
import { getSimpleIconRequestType } from '../GetSimpleIconRequestType/GetSimpleIconRequestType.ts'

export const toSimpleIconRequest = (request: IconRequest): any => {
  return {
    ...(request.expanded && { expanded: true }),
    name: request.name,
    type: getSimpleIconRequestType(request.type),
  }
}
