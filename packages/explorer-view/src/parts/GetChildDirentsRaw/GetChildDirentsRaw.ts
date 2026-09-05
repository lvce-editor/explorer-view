import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as Assert from '../Assert/Assert.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { hasSymbolicLinks } from '../HasSymbolicLink/HasSymbolicLink.ts'
import * as ResolveSymbolicLinks from '../ResolveSymbolicLinks/ResolveSymbolicLinks.ts'

export const getChildDirentsRaw = async (uri: string, applicationId?: string): Promise<readonly RawDirent[]> => {
  const rawDirents = await FileSystem.readDirWithFileTypes(uri, applicationId)
  Assert.array(rawDirents)
  if (hasSymbolicLinks(rawDirents)) {
    return ResolveSymbolicLinks.resolveSymbolicLinks(uri, rawDirents, applicationId)
  }
  return rawDirents
}
