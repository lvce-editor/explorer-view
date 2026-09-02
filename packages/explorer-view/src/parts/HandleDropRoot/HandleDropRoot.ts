import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleDropRootDefault from '../HandleDropRootDefault/HandleDropRootDefault.ts'
import * as HandleDropRootElectron from '../HandleDropRootElectron/HandleDropRootElectron.ts'
import { handleInternalDrop } from '../HandleInternalDrop/HandleInternalDrop.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'

interface DropHandler {
  (state: ExplorerState, fileHandles: readonly FileSystemHandle[], paths: readonly string[]): Promise<ExplorerState>
}

const getModule = (isElectron: boolean): DropHandler => {
  if (isElectron) {
    return HandleDropRootElectron.handleDrop
  }
  return HandleDropRootDefault.handleDrop
}

export const handleDropRoot = async (
  state: ExplorerState,
  fileHandles: readonly FileSystemHandle[],
  paths: readonly string[],
): Promise<ExplorerState> => {
  const { isReadonly, platform, root } = state
  if (isReadonly && root !== '') {
    return state
  }
  if (fileHandles.length === 0 && paths.length > 0) {
    return handleInternalDrop(state, paths, -1)
  }
  const isElectron = platform === PlatformType.Electron
  const fn = getModule(isElectron)
  return fn(state, fileHandles, paths)
}
