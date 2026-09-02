import { DragAndDropWorker, RendererWorker } from '@lvce-editor/rpc-registry'

export interface ExplorerDroppedItems {
  readonly fileHandles: readonly FileSystemHandle[]
  readonly paths: readonly string[]
  readonly uris: readonly string[]
}

const toExplorerDroppedItems = (
  result: Awaited<ReturnType<typeof DragAndDropWorker.getDroppedItemsByDropId>>,
  isElectron: boolean,
): ExplorerDroppedItems => {
  const files = isElectron ? result.files : result.files.filter((file) => file.handle)
  const fileHandles = files.map((file) => file.handle ?? ({ kind: file.kind, name: file.name } as FileSystemHandle))
  const paths = files.map((file) => file.path)
  return { fileHandles, paths, uris: result.uris }
}

export const getDroppedItemsByDropId = async (dropId: number, isElectron: boolean): Promise<ExplorerDroppedItems> => {
  const result = await DragAndDropWorker.getDroppedItemsByDropId(dropId, isElectron)
  return toExplorerDroppedItems(result, isElectron)
}

export const getClipboardItems = async (itemIds: readonly number[], isElectron: boolean): Promise<ExplorerDroppedItems> => {
  const items = await RendererWorker.getFileHandles(itemIds)
  const files = items.filter((item) => item.kind === 'file' || (isElectron && item.kind === 'file-legacy'))
  const fileHandles = files.map((item) => {
    if (item.kind === 'file') {
      return item.value as FileSystemHandle
    }
    return { kind: 'file', name: (item.value as File).name } as FileSystemFileHandle
  })
  const paths = files.map((item) => item.path ?? '')
  return { fileHandles, paths, uris: [] }
}
