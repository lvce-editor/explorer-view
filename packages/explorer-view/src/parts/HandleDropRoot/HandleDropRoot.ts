const getModule = (isElectron: boolean): any => {
  if (isElectron) {
    return import('../HandleDropRootElectron/HandleDropRootElectron.ts')
  }
  return import('../HandleDropRootDefault/HandleDropRootDefault.ts')
}

export const handleDropRoot = async (state: any, files: any): Promise<any> => {
  const module = await getModule(state.isElectron)
  return module.handleDrop(state, files)
}
