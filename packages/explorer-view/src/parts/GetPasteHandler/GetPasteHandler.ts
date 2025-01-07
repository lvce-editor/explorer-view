import * as HandlePasteCopy from '../HandlePasteCopy/HandlePasteCopy.ts'
import * as HandlePasteCut from '../HandlePasteCut/HandlePasteCut.ts'
import * as HandlePasteNone from '../HandlePasteNone/HandlePasteNone.ts'
import * as NativeFileTypes from '../NativeFileTypes/NativeFileTypes.ts'
import { PasteHandler } from '../PasteHandler/PasteHandler.ts'

export const getPasteHandler = (type: string): PasteHandler => {
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
  switch (type) {
    case NativeFileTypes.None:
      return HandlePasteNone.handlePasteNone
    case NativeFileTypes.Copy:
      return HandlePasteCopy.handlePasteCopy
    case NativeFileTypes.Cut:
      return HandlePasteCut.handlePasteCut
    default:
      throw new Error(`unexpected native paste type: ${type}`)
  }
}
