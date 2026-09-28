import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

export const openFolder = async (applicationId?: string): Promise<void> => {
  await ApplicationRpc.invoke(applicationId, 'Dialog.openFolder')
}
