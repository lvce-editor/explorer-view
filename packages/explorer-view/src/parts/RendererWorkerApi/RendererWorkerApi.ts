export interface RendererWorkerApi {
  readonly 'ClipBoard.readNativeFiles': () => Promise<readonly string[]>
  readonly 'ClipBoard.writeNativeFiles': (type: string, files: readonly string[]) => Promise<void>
  readonly 'ClipBoard.writeText': (text: string) => Promise<void>
  readonly 'ContextMenu.show': (x: number, y: number, id: number, ...args: readonly any[]) => Promise<void>
  readonly 'FileSystem.copy': (oldUri: string, newUri: string) => Promise<void>
  readonly 'FileSystem.readDirWithFileTypes': (uri: string) => Promise<readonly any[]>
  readonly 'FileSystem.remove': (uri: string) => Promise<void>
  readonly 'FileSystem.rename': (oldUri: string, newUri: string) => Promise<void>
  readonly 'FileSystem.getPathSeparator': (root: string) => Promise<string>
  readonly 'FileSystem.getRealPath': (root: string) => Promise<string>
  readonly 'FileSystem.createFile': (uri: string) => Promise<void>
  readonly 'FileSystem.stat': (root: string) => Promise<any>
  readonly 'FileSystem.writeFile': (uri: string, content: string) => Promise<void>
  readonly 'FileSystem.mkdir': (uri: string) => Promise<void>
  readonly 'Focus.setFocus': (focusId: number) => Promise<void>
  readonly 'GetFilePathElectron.getFilePathElectron': (file: File) => Promise<string>
  readonly 'IconTheme.getFileIcon': (options: { readonly name: string }) => Promise<string>
  readonly 'IconTheme.getFolderIcon': (options: { readonly name: string }) => Promise<string>
  readonly 'Main.openUri': (uri: string) => Promise<string>
  readonly 'OpenNativeFolder.openNativeFolder': (path: string) => Promise<void>
  readonly 'Preferences.get': (key: string) => Promise<string>
  readonly 'Workspace.getPath': () => Promise<string>
}
