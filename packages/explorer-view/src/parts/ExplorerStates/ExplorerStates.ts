import * as ViewletRegistry from '@lvce-editor//viewlet-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const { get, set, wrapCommand, registerCommands, getCommandIds, wrapGetter } = ViewletRegistry.create<ExplorerState>()
