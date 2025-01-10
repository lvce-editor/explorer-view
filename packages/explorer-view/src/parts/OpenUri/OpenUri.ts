import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const openUri = async (uri: string, focus: boolean): Promise<void> => {
  await ParentRpc.invoke(/* Main.openAbsolutePath */ 'Main.openUri', /* absolutePath */ uri, /* focus */ focus)
}
