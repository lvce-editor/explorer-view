import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as GetFocusedDirent from '../GetFocusedDirent/GetFocusedDirent.ts'

export const handleCopy = async (state: any): Promise<any> => {
  // TODO handle multiple files
  // TODO if not file is selected, what happens?
  const dirent = GetFocusedDirent.getFocusedDirent(state)
  if (!dirent) {
    console.info('[ViewletExplorer/handleCopy] no dirent selected')
    return
  }
  const absolutePath = dirent.path
  // TODO handle copy error gracefully
  const files = [absolutePath]
  await ClipBoard.writeNativeFiles('copy', files)
  return state
}
