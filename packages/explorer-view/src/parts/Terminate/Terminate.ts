import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

export const terminate = (): void => {
  ExplorerStates.clear()
  globalThis.close()
}
