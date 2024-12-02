import * as HandleDropRootElectron from '../HandleDropRootElectron/HandleDropRootElectron.ts'
import * as HandleDropRootDefault from '../HandleDropRootDefault/HandleDropRootDefault.ts'

const getModule = (isElectron: boolean): any => {
  if (isElectron) {
    return HandleDropRootElectron
  }
  return HandleDropRootDefault
}

export const handleDropRoot = async (state: any, files: any): Promise<any> => {
  const module = await getModule(state.isElectron)
  return module.handleDrop(state, files)
}
