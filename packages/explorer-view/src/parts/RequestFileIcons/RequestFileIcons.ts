import type { IconRequest } from '../IconRequest/IconRequest.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetFileIcon from '../GetFileIcon/GetFileIcon.ts'
import * as GetFolderIcon from '../GetFolderIcon/GetFolderIcon.ts'

export const requestFileIcons = async (requests: readonly IconRequest[]): Promise<readonly string[]> => {
  const promises = requests.map((request) =>
    request.type === DirentType.File ? GetFileIcon.getFileIcon(request.name) : GetFolderIcon.getFolderIcon(request.name),
  )
  return Promise.all(promises)
}
