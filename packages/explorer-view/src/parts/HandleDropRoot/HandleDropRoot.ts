import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleDropRootDefault from '../HandleDropRootDefault/HandleDropRootDefault.ts'
import * as HandleDropRootElectron from '../HandleDropRootElectron/HandleDropRootElectron.ts'

const getModule = (isElectron: boolean): any => {
  if (isElectron) {
    return HandleDropRootElectron.handleDrop
  }
  return HandleDropRootDefault.handleDrop
}

export const handleDropRoot = async (state: ExplorerState, files: any): Promise<ExplorerState> => {
  // @ts-ignore
  const fn = await getModule(state.isElectron)
  return fn(state, files)
}
