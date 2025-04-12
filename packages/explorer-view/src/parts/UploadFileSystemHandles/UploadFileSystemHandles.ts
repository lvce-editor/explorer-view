export const uploadFileSystemHandles = async (
  root: string,
  pathSeparator: string,
  fileSystemHandles: readonly FileSystemHandle[],
): Promise<boolean> => {
  // console.log({ fileSystemHandles })
  // @ts-ignore
  const files: readonly FileSystemHandle[] = [...fileSystemHandles]

  // @ts-ignore
  for (const file of files) {
    // console.log({
    //   file,
    //   kind: file.kind,
    //   name: file.name,
    //   // text: await file.text(),
    // })
  }
  // console.log({ files })

  // TODO
  // 1. in electron, use webutils.getPathForFile to see if a path is available
  // 2. else, walk all files and folders recursively and upload all of them (if there are many, show a progress bar)

  // TODO send file system operations to renderer worker
  return true
}
