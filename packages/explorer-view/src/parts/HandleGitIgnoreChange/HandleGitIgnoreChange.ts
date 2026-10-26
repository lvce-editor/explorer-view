import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleGitIgnoreChange = (state: ExplorerState, root: string): ExplorerState => {
  const { gitIgnoreDecorations, gitIgnoreGeneration, root: currentRoot } = state
  if (currentRoot !== root || !gitIgnoreDecorations) return state
  return {
    ...state,
    gitIgnoreGeneration: gitIgnoreGeneration + 1,
  }
}
