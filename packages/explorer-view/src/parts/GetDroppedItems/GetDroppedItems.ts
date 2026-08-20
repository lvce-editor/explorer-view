import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { DroppedArgs } from '../UploadFileSystemHandles/UploadFileSystemHandles.ts'

export interface ExplorerDroppedItems {
  readonly fileHandles: DroppedArgs
  readonly paths: readonly string[]
  readonly uris: readonly string[]
}

export const getDroppedItems = async (dropIdOrItemIds: number | readonly number[], isElectron: boolean): Promise<ExplorerDroppedItems> => {
  const result =
    typeof dropIdOrItemIds === 'number'
      ? await DragAndDropWorker.getDroppedItemsByDropId(dropIdOrItemIds, isElectron)
      : await DragAndDropWorker.getDroppedItems(dropIdOrItemIds, isElectron)
  const files = isElectron ? result.files : result.files.filter((file) => file.handle)
  const fileHandles = files.map((file) => file.handle || ({ kind: file.kind, name: file.name } as FileSystemHandle))
  const paths = files.map((file) => file.path)
  return { fileHandles, paths, uris: result.uris }
}
