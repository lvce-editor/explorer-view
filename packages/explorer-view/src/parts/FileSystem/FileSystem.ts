import * as ApplicationRpc from '../ApplicationRpc/ApplicationRpc.ts'

export const remove = async (dirent: string, applicationId?: string): Promise<void> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.remove', dirent)
}

export const readDirWithFileTypes = async (uri: string, applicationId?: string): Promise<readonly any[]> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.readDirWithFileTypes', uri)
}

export const readFile = async (uri: string, applicationId?: string): Promise<string> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.readFile', uri)
}

export const isReadonly = async (root: string, applicationId?: string): Promise<boolean> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.isReadonly', root)
}

export const getRealPath = async (path: string, applicationId?: string): Promise<string> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.getRealPath', path)
}

export const stat = async (dirent: string, applicationId?: string): Promise<any> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.stat', dirent)
}

export const writeFile = async (uri: string, content: string, applicationId?: string): Promise<void> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.writeFile', uri, content)
}

export const mkdir = async (uri: string, applicationId?: string): Promise<void> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.mkdir', uri)
}

export const rename = async (oldUri: string, newUri: string, applicationId?: string): Promise<void> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.rename', oldUri, newUri)
}

export const copy = async (oldUri: string, newUri: string, applicationId?: string): Promise<void> => {
  return ApplicationRpc.invoke(applicationId, 'FileSystem.copy', oldUri, newUri)
}
