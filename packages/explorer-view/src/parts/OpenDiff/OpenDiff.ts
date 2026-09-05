import * as OpenUri from '../OpenUri/OpenUri.ts'

export const openDiff = async (leftUri: string, rightUri: string, focus: boolean, applicationId?: string): Promise<void> => {
  await OpenUri.openUri(`diff://${leftUri}<->${rightUri}`, focus, undefined, applicationId)
}
