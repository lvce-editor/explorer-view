import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as GetPasteHandler from '../GetPasteHandler/GetPasteHandler.ts'

export const handlePaste = async (state: ExplorerState): Promise<ExplorerState> => {
  const nativeFiles = await ClipBoard.readNativeFiles()
  // TODO detect cut/paste event, not sure if that is possible
  // TODO check that pasted folder is not a parent folder of opened folder
  // TODO support pasting multiple paths
  // TODO what happens when pasting multiple paths, but some of them error?
  // how many error messages should be shown? Should the operation be undone?
  // TODO what if it is a large folder and takes a long time to copy? Should show progress
  // TODO what if there is a permission error? Probably should show a modal to ask for permission
  // TODO if error is EEXISTS, just rename the copy (e.g. file-copy-1.txt, file-copy-2.txt)
  // TODO actual target should be selected folder
  // TODO but what if a file is currently selected? Then maybe the parent folder
  // TODO but will it work if the folder is a symlink?
  // TODO handle error gracefully when copy fails
  const fn = GetPasteHandler.getPasteHandler(nativeFiles.type)
  return fn(state, nativeFiles)
}
