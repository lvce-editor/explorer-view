export interface RendererWorkerApi {
  readonly 'ClipBoard.writeText': (text: string) => Promise<void>
  readonly 'ElectronDialog.showMessageBox': (options: any) => Promise<any>
  readonly 'GetWindowId.getWindowId': () => Promise<number>
  readonly 'Process.getChromeVersion': () => Promise<string>
  readonly 'Process.getNodeVersion': () => Promise<string>
  readonly 'Process.getElectronVersion': () => Promise<string>
  readonly 'Viewlet.closeWidget': (widgetId: string) => Promise<string>
  readonly 'Viewlet.openWidget': (widgetId: string) => Promise<string>
  readonly 'Focus.setFocus': (focusId: number) => Promise<string>
}
