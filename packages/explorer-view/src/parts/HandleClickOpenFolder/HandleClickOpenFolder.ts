import * as OpenFolder from '../OpenFolder/OpenFolder.ts'

export const handleClickOpenFolder = async (state: any): Promise<any> => {
  await OpenFolder.openFolder()
  return state
}
