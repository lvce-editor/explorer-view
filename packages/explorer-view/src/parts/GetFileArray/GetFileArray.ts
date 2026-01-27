export const getFileArray = (fileList: FileList): readonly File[] => {
  const files = [...fileList]
  return files
}
