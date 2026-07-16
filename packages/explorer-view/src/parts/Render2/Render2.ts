import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ApplyRender from '../ApplyRender/ApplyRender.ts'
import * as Diff from '../Diff/Diff.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'

const isEqualArray = (left: readonly number[], right: readonly number[]): boolean => {
  return left.length === right.length && left.every((value, index) => value === right[index])
}

const getDebugState = (state: ExplorerState): Readonly<Record<string, unknown>> => {
  return {
    editingIndex: state.editingIndex,
    editingType: state.editingType,
    editingValue: state.editingValue,
    focus: state.focus,
    focusedIndex: state.focusedIndex,
    itemCount: state.items.length,
    itemNames: state.items.slice(0, 20).map((item) => item.name),
  }
}

export const render2 = (uid: number, diffResult: readonly number[]): readonly any[] => {
  const { oldState, scheduledState } = ExplorerStates.get(uid)
  const currentDiffResult = Diff.diff(oldState, scheduledState)
  if (!isEqualArray(diffResult, currentDiffResult)) {
    throw new Error(
      `[flaky-e2e-debug] stale explorer diff: ${JSON.stringify({
        currentDiffResult,
        diffResult,
        oldState: getDebugState(oldState),
        scheduledState: getDebugState(scheduledState),
        uid,
      })}`,
    )
  }
  ExplorerStates.set(uid, scheduledState, scheduledState)
  const commands = ApplyRender.applyRender(oldState, scheduledState, diffResult)
  return commands
}
