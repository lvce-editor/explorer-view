import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ViewletRegistry from '@lvce-editor//viewlet-registry'

export const { get, set, wrapCommand } = ViewletRegistry.create<ExplorerState>()
