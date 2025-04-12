import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleDropRootDefault from '../HandleDropRootDefault/HandleDropRootDefault.ts'
import * as HandleDropRootElectron from '../HandleDropRootElectron/HandleDropRootElectron.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

interface DropHandler {
  (state: ExplorerState, files: readonly FileSystemHandle[]): Promise<ExplorerState>
}

const getModule = (isElectron: boolean): DropHandler => {
  if (isElectron) {
    return HandleDropRootElectron.handleDrop
  }
  return HandleDropRootDefault.handleDrop
}

export const handleDropRoot = async (state: ExplorerState, files: readonly FileSystemHandle[]): Promise<ExplorerState> => {
  const isElectron = state.platform === PlatformType.Electron
  const fn = getModule(isElectron)
  return fn(state, files)
}
