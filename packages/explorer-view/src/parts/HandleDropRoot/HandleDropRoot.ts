import * as HandleDropRootElectron from '../HandleDropRootElectron/HandleDropRootElectron.ts'
import * as HandleDropRootDefault from '../HandleDropRootDefault/HandleDropRootDefault.ts'

const getModule = (isElectron: boolean): any => {
  if (isElectron) {
    return HandleDropRootElectron.handleDrop
  }
  return HandleDropRootDefault.handleDrop
}

export const handleDropRoot = async (state: any, files: any): Promise<any> => {
  const fn = await getModule(state.isElectron)
  return fn(state, files)
}
